# Copyright 2019 The Bazel Authors. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Starlark rules for using gRPC-Web with Bazel and `rules_closure`."""

load("@rules_proto//proto:defs.bzl", "ProtoInfo")
load("@npm_bazel_typescript//:index.bzl", "ts_library")

# This was borrowed from Rules Go, licensed under Apache 2.
# https://github.com/bazelbuild/rules_go/blob/67f44035d84a352cffb9465159e199066ecb814c/proto/compiler.bzl#L72
def _proto_path(proto):
    path = proto.path
    root = proto.root.path
    ws = proto.owner.workspace_root
    if path.startswith(root):
        path = path[len(root):]
    if path.startswith("/"):
        path = path[1:]
    if path.startswith(ws):
        path = path[len(ws):]
    if path.startswith("/"):
        path = path[1:]
    return path

def _proto_include_path(proto):
    path = proto.path[:-len(_proto_path(proto))]
    if not path:
        return "."
    if path.endswith("/"):
        path = path[:-1]
    return path

def _proto_include_paths(protos):
    return [_proto_include_path(proto) for proto in protos]

def _generate_closure_grpc_web_src_progress_message(name):
    # TODO(yannic): Add a better message?
    return "Generating GRPC Web %s" % name

def _generate_closure_grpc_web_srcs(
        actions,
        protoc,
        protoc_gen_grpc_web,
        import_style,
        mode,
        sources,
        transitive_sources):
    all_sources = [src for src in sources] + [src for src in transitive_sources.to_list()]
    proto_include_paths = [
        "-I%s" % p
        for p in _proto_include_paths(
            [f for f in all_sources],
        )
    ]

    grpc_web_out_common_options = ",".join([
        "import_style={}".format(import_style),
        "mode={}".format(mode),
    ])

    files = []
    for src in sources:
        name = "{}.grpc.ts".format(
            ".".join(src.path.split("/")[-1].split(".")[:-1]),
        )
        js = actions.declare_file(name)
        files.append(js)

        args = proto_include_paths + [
            "--plugin=protoc-gen-grpc-web={}".format(protoc_gen_grpc_web.path),
            "--grpc-web_out={options},out={out_file}:{path}".format(
                options = grpc_web_out_common_options,
                out_file = name,
                path = js.path[:js.path.rfind("/")],
            ),
            src.path,
        ]

        actions.run(
            tools = [protoc_gen_grpc_web],
            inputs = all_sources,
            outputs = [js],
            executable = protoc,
            arguments = args,
            progress_message =
                _generate_closure_grpc_web_src_progress_message(name),
        )

    return files

_error_multiple_deps = "".join([
    "'deps' attribute must contain exactly one label ",
    "(we didn't name it 'dep' for consistency). ",
    "We may revisit this restriction later.",
])

def _closure_grpc_web_library_impl(ctx):
    if len(ctx.attr.deps) > 1:
        # TODO(yannic): Revisit this restriction.
        fail(_error_multiple_deps, "deps")

    proto_info = ctx.attr.deps[0][ProtoInfo]
    srcs = _generate_closure_grpc_web_srcs(
        actions = ctx.actions,
        protoc = ctx.executable._protoc,
        protoc_gen_grpc_web = ctx.executable._protoc_gen_grpc_web,
        import_style = ctx.attr.import_style,
        mode = ctx.attr.mode,
        sources = proto_info.direct_sources,
        transitive_sources = proto_info.transitive_imports,
    )

    # deps = unfurl(ctx.attr.deps, provider = "closure_js_library")
    # deps.append(ctx.attr._runtime)
    # library = ts_library(
    #     ctx = ctx,
    #     srcs = srcs,
    #     deps = deps,
    #     suppress = [
    #         "misplacedTypeAnnotation",
    #         "unusedPrivateMembers",
    #         "reportUnknownTypes",
    #         "strictDependencies",
    #         "extraRequire",
    #     ],
    #     lenient = False,
    # )

    # `rules_closure` still uses the legacy provider syntax.
    # buildifier: disable=rule-impl-return
    return struct(
        files = depset(srcs),
    )

closure_grpc_web_library = rule(
    implementation = _closure_grpc_web_library_impl,
    attrs = dict({
        "deps": attr.label_list(
            mandatory = True,
            providers = [ProtoInfo],
        ),
        "import_style": attr.string(
            default = "commonjs",
            values = ["commonjs"],
        ),
        "mode": attr.string(
            default = "grpcwebtext",
            values = ["grpcwebtext", "grpcweb"],
        ),

        # Internal only.

        # TODO(yannic): Switch to using `proto_toolchain` after
        # https://github.com/bazelbuild/rules_proto/pull/25 lands.
        "_protoc": attr.label(
            default = Label("@com_google_protobuf//:protoc"),
            executable = True,
            cfg = "host",
        ),

        # TODO(yannic): Create `grpc_web_toolchain`.
        "_protoc_gen_grpc_web": attr.label(
            default = Label("@grpc-web//javascript/net/grpc/web:protoc-gen-grpc-web"),
            executable = True,
            cfg = "host",
        ),
        "_runtime": attr.label(
            default = Label("@grpc-web//javascript/net/grpc/web:closure_grpcweb_runtime"),
        ),
    }),
)

def flat_ts_library(name, srcs, deps, deps_to_flatten, flat_files):
    flatten = [
        "/usr/bin/find bazel-out/ -type f -exec /bin/mv -i '{}' . ';'",
        "/usr/bin/find bazel-out/ -type l -exec /bin/mv -i '{}' . ';'",
        "ls -1a",
    ] + ["cp " + f + " $(RULEDIR)" for f in flat_files]

    native.genrule(
        name = name + "_flatten",
        outs = flat_files,
        srcs = deps_to_flatten,
        cmd_bash = " && ".join(flatten),
    )

    ts_library(
        name = name,
        srcs = srcs + [f for f in flat_files if f.endswith("ts")],
        deps = deps,
    )
