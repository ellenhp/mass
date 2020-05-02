// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#pragma once

#include "mass/api/systems.pb.h"
#include "sim_system.hh"

namespace mass {
namespace systems {
class MapSystem : public SimSystem {
 public:
  MapSystem(api::MapSystem map_system);

  virtual void setup_spawn_state(api::SpawnedVessel spawned_state);

 private:
  api::Position position;
};
}  // namespace systems
}  // namespace mass