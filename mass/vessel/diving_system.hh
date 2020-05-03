// Copyright 2020 Ellen Poe
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
#include "mass/vessel/sim_system.hh"
#include "mass/vessel/sim_vessel.hh"

namespace mass {
namespace vessel {
class DivingSystem : public SimSystem {
 public:
  DivingSystem(api::DivingSystem diving_system);

  virtual void setup_spawn_state(api::SpawnedVessel spawned_state) override;
  virtual void populate_system_update(
      api::SystemUpdate* system_update) override;

  virtual void step(float dt, SimVessel& parent) override;

 private:
  const uint32_t max_depth_feet_;
  const double feet_per_second_;

  uint32_t requested_depth_feet_;
};
}  // namespace vessel
}  // namespace mass
