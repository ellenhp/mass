# Copyright (C) 2020 Ellen Poe
# 
# This file is part of MASS.
# 
# MASS is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# MASS is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
# 
# You should have received a copy of the GNU General Public License
# along with MASS.  If not, see <http://www.gnu.org/licenses/>.

from bloop.api import bloop_pb2_grpc, bloop_pb2
import grpc
import concurrent.futures as futures
import arlpy.uwapm as pm
import numpy as np
import random

class BloopServicer(bloop_pb2_grpc.BloopServicer):
  def Propagate(self, request, context):
    bathymetry = [[point.range_meters, point.depth_meters] for point in request.bathymetry.points]
    ssp = [[point.depth_meters, point.sound_speed] for point in request.ssp.speed_points]

    env = pm.create_env2d(rx_range=np.asarray(request.ranges),
                          rx_depth=np.asarray(request.depths),
                          tx_depth=request.source_depth,
                          depth=np.asarray(bathymetry),
                          tx_directionality=[(0, -1000), (5, 2), (175, 2), (180, -1000)],
                          frequency=request.frequency,
                          nbeams=50,
                          soundspeed=np.asarray(ssp))
    loss = pm.compute_transmission_loss(env, mode=pm.incoherent).to_numpy()
    response = bloop_pb2.PropagateResponse()
    depth_index = 0
    for row in loss:
      depth = request.depths[depth_index]

      row_index = 0
      for r in row:
        point = bloop_pb2.PropagationLossGrid.PropagationLossPoint()
        point.depth_meters = depth
        point.range_meters = request.ranges[row_index]
        point.loss = np.absolute(r)
        response.loss.points.append(point)
        row_index += 1
      depth_index += 1
    return response

def start(should_wait = True):
  print("Starting server")
  server = grpc.server(futures.ThreadPoolExecutor(max_workers=30))
  bloop_pb2_grpc.add_BloopServicer_to_server(BloopServicer(), server)
  server.add_insecure_port('0.0.0.0:50052')
  server.start()
  if (should_wait):
    hour = 3600
    timeout = random.randint(2 * hour, 3 * hour)
    print("Waiting {} seconds, then shutting down.".format(timeout))
    server.wait_for_termination(timeout=timeout)

if __name__ == "__main__": 
  start()
