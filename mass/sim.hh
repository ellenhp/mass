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

#include <map>
#include <string>

#include "mass/api/requests.pb.h"
#include "mass/api/scenario.pb.h"
#include "sim_vessel.hh"

namespace mass {
class Sim {
 public:
  Sim(api::Scenario scenario);

  void process_request(api::MassRequest mass_request);

  void step(float dt);

  void get_update_for(std::string vessel_unique_id);

 private:
  std::map<std::string, std::shared_ptr<SimVessel>> vessels;
  std::map<std::string, api::VesselDescriptor> vessel_descriptors;
};
}  // namespace mass
