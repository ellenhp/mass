load("@io_bazel_rules_kotlin//kotlin:kotlin.bzl", "kt_jvm_library")

kt_jvm_library(
    name = "vessel",
    srcs = glob(["*.kt"]),
    visibility = ["//substrate:__subpackages__"],
    deps = [
        "//mass/api:java_actions_proto",
        "//mass/api:java_mass_grpc",
        "//mass/api:java_systems_proto",
        "//mass/api:java_updates_proto",
        "//mass/api:java_weapons_proto",
        "//substrate/sonar",
        "//substrate/utils",
        "@com_github_jetbrains_kotlin//:kotlin-stdlib-jdk8",
    ],
)
