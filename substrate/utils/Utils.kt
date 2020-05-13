package substrate.utils

import api.Spatial
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin

class Utils {
    companion object {
        fun calculateBearingRadians(pos1: Spatial.Position, pos2: Spatial.Position): Double {
            val deltaLng = pos2.lng - pos1.lng
            val y = sin(deltaLng) * cos(pos2.lat)
            val x = cos(pos1.lat) * sin(pos2.lat) - (sin(pos1.lat)
                    * cos(pos2.lat) * cos(deltaLng))
            val radiansInCircle = Math.PI * 2
            return (atan2(y, x) + radiansInCircle) % radiansInCircle
        }
    }
}