import mongoose from 'mongoose';

const SightseeingSchema = new mongoose.Schema({
  who_what: {
    name_en: { type: String, required: true },
    aliases: [String],
    category_primary: String,
    category_tags: [String],
    year_founded: String,
    government_status: String,
    unesco_status: Boolean,
    tagline: String,
    description_short: String,
    description_long: String,
    spot_id: String,
    external_id_google: String,
    media: {
      primary_photo_url: String,
      gallery_urls: [String],
      external_page_urls: [String]
    }
  },
  where: {
    hierarchy: {
      prefecture: String,
      municipality: String,
      neighborhood: String,
      block_number: String
    },
    address: {
      postal_code: String,
      en: String
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true } // [lng, lat]
    },
    plus_code: String,
    elevation_meters: Number
  },
  how: {
    rail: {
      station_names_codes: String,
      recommended_exit_gate: String,
      walk_time_min: Number
    },
    bus: { bus_stop_name: String },
    road: {
      parking_available: Boolean,
      parking_fees: String,
      taxi_drop_off_point: {
        type: { type: String, enum: ['Point'] },
        coordinates: [Number]
      }
    }
  },
  ticketing: {
    pricing: {
      adult: Number,
      senior: Number,
      high_school: Number,
      middle_school: Number,
      elementary: Number,
      infant: Number
    },
    is_dynamic_pricing: Boolean,
    weekday_price: Number,
    weekend_holiday_price: Number,
    group_discount_min_size: Number,
    group_rate_per_person: Number,
    membership_benefits: [String],
    payment_methods: [String],
    advance_purchase_required: Boolean,
    official_booking_url: String,
    fullrefund_before_day: Number,
    currency: { type: String, default: "JPY" }
  },
  schedule: {
    opening_time: String,
    closing_time: String,
    last_entry_time: String,
    is_24_hours: Boolean,
    regular_closed_days: [String],
    seasonal_opening_notes: String,
    entry_system: String
  },
  facilities: {
    wheelchair_access_level: String,
    elevator_availability: Boolean,
    stepless_routes: Boolean,
    rental_mobility_aids: [String],
    vegetarian_vegan_options: Boolean,
    audio_guide_languages: [String],
    photography_allowed: { type: Boolean, default: true }
  },
  seasonal: {
    sakura: { is_spot: Boolean, peak_window: String },
    koyo: { is_spot: Boolean, peak_window: String },
    winter: { is_snow_spot: Boolean, peak_snow_window: String },
    special_events: {
      has_event: Boolean,
      name: String,
      range: { start: String, end: String }
    },
    night_light_up: Boolean
  },
  socials: {
    official_website_en: String,
    official_website_jp: String,
    instagram: String,
    line_official_account: String,
    phone_number: String,
    phone_support_languages: [String],
    email_inquiry: String,
    emergency_contact: String
  },
  vibe: {
    average_daily_visitors: Number,
    peak_hours: [String],
    best_time_to_avoid_crowds: String,
    vibe_primary: String,
    target_audience: [String]
  }
}, { timestamps: true });

// Critical for "near me" searches later
SightseeingSchema.index({ "where.location": "2dsphere" });

export default mongoose.models.Sightseeing || mongoose.model('Sightseeing', SightseeingSchema);