package substrate.utils

import api.Spatial
import kotlin.math.*
import java.time.Duration

class Utils {
    companion object {
        fun calculateBearingRadians(pos1: Spatial.Position, pos2: Spatial.Position): Double {
            val deltaLng = pos1.lng - pos2.lng
            val y = sin(deltaLng) * cos(pos2.lat)
            val x = cos(pos1.lat) * sin(pos2.lat) - (sin(pos1.lat)
                    * cos(pos2.lat) * cos(deltaLng))
            val radiansInCircle = Math.PI * 2
            return (atan2(y, x) + radiansInCircle) % radiansInCircle
        }

        fun toMeters(feet: Double): Float {
            return feet.toFloat() / 3.28084f
        }

        fun toFeet(meters: Double): Float {
            return meters.toFloat() * 3.28084f
        }

        fun distanceMeters(pos1: Spatial.Position, pos2: Spatial.Position): Double {
            // Mean radius of the earth
            val radiusMeters = 6_371_008.8
            return 2 * radiusMeters *
                    asin(sqrt(
                            sin((Math.toRadians(pos2.lat) - Math.toRadians(pos1.lat)) / 2).pow(2.0) +
                                    cos(Math.toRadians(pos1.lat)) * cos(Math.toRadians(pos2.lat)) *
                                    sin((Math.toRadians(pos2.lng) - Math.toRadians(pos1.lng)) / 2).pow(2.0)
                    ))
        }

        fun stepPosition(position: Spatial.Position, heading: Double, speedKnots: Double, dt: Duration): Spatial.Position {
            // We'll need this later, compute it now for clarity :)
            val absoluteLatitudeRadians = position.lat / 180 * Math.PI

            // Determine the components of the velocity in a locally cartesian X-Y
            // grid, in knots.
            val headingRadians = heading / 180 * Math.PI
            // A heading of zero is due north, so we need to use sin for X and cos for Y.
            val xKnots = speedKnots * sin(headingRadians)
            val yKnots = speedKnots * cos(headingRadians)

            @Suppress("UnnecessaryVariable")
            // One knot is 1 nmi / hr, which approximates to one minute of latitude / hr.
            val latMinutesPerHour = yKnots;
            // Longitudinal speed depends on our absolute latitude.
            val lngMinutesPerHour = xKnots / cos(absoluteLatitudeRadians)

            val dtHours = dt.toNanos().toDouble() / Duration.ofHours(1).toNanos()
            val newPosition = Spatial.Position.newBuilder()
                    .setLat(position.lat + dtHours * latMinutesPerHour / 60)
                    .setLng(position.lng + dtHours * lngMinutesPerHour / 60)
                    .build()
            return newPosition
        }
    }
}

fun Spatial.Position.format(): String {
    return "(${lat}, ${lng})"
}