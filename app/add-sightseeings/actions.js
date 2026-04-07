'use server'

import dbConnect from '@/lib/db';
import Sightseeing from '@/models/Sightseeing';
import { revalidatePath } from 'next/cache';

export async function addSightseeing(formData) {
    await dbConnect();

    // Helper: Converts "Tag 1, Tag 2" into ["Tag 1", "Tag 2"]
    // Also removes empty strings and extra spaces
    const toArray = (fieldName) => {
        const value = formData.get(fieldName);
        if (!value) return [];
        return value.split(',').map(item => item.trim()).filter(item => item !== "");
    };

    try {
        const finalData = {
            // SECTION 1: WHO / WHAT
            who_what: {
                name_en: formData.get('name_en'),
                aliases: toArray('aliases'),
                category_primary: formData.get('category_primary'),
                category_tags: toArray('category_tags'),
                year_founded: formData.get('year_founded'),
                government_status: formData.get('government_status'),
                unesco_status: formData.get('unesco_status') === 'on',
                tagline: formData.get('tagline'),
                description_short: formData.get('description_short'),
                description_long: formData.get('description_long'),
                spot_id: formData.get('spot_id'),
                external_id_google: formData.get('external_id_google'),
                media: {
                    primary_photo_url: formData.get('primary_photo_url'),
                    gallery_urls: toArray('gallery_urls'),
                    external_page_urls: toArray('external_page_urls')
                }
            },

            // SECTION 2: WHERE
            where: {
                hierarchy: {
                    prefecture: formData.get('prefecture'),
                    municipality: formData.get('municipality'),
                    neighborhood: formData.get('neighborhood'),
                    block_number: formData.get('block_number')
                },
                address: {
                    postal_code: formData.get('postal_code'),
                    en: formData.get('address_full_en')
                },
                // GeoJSON format for MongoDB Geospatial Queries
                location: {
                    type: "Point",
                    coordinates: [
                        parseFloat(formData.get('lng')), // Longitude first
                        parseFloat(formData.get('lat'))  // Latitude second
                    ]
                },
                plus_code: formData.get('plus_code'),
                elevation_meters: Number(formData.get('elevation_meters')) || 0
            },

            // SECTION 3: HOW
            how: {
                rail: {
                    station_names_codes: formData.get('station_names_codes'),
                    recommended_exit_gate: formData.get('recommended_exit_gate'),
                    walk_time_min: Number(formData.get('walk_time_min')) || 0
                },
                bus: {
                    bus_stop_name: formData.get('bus_stop_name')
                },
                road: {
                    parking_available: formData.get('parking_available') === 'on',
                    parking_fees: formData.get('parking_fees'),
                    taxi_drop_off_point: formData.get('taxi_lng') && formData.get('taxi_lat') ? {
                        type: "Point",
                        coordinates: [parseFloat(formData.get('taxi_lng')), parseFloat(formData.get('taxi_lat'))]
                    } : null
                }
            },

            // SECTION 4: TICKETING
            ticketing: {
                pricing: {
                    adult: Number(formData.get('adult_price')) || 0,
                    senior: Number(formData.get('senior_price')) || 0,
                    high_school: Number(formData.get('student_high_school_price')) || 0,
                    middle_school: Number(formData.get('student_middle_school_price')) || 0,
                    elementary: Number(formData.get('student_elementary_price')) || 0,
                    infant: Number(formData.get('infant_child_price')) || 0
                },
                is_dynamic_pricing: formData.get('is_dynamic_pricing') === 'on',
                weekday_price: Number(formData.get('weekday_price')) || 0,
                weekend_holiday_price: Number(formData.get('weekend_holiday_price')) || 0,
                group_discount_min_size: Number(formData.get('group_discount_min_size')) || 0,
                group_rate_per_person: Number(formData.get('group_rate_per_person')) || 0,
                membership_benefits: toArray('membership_benefits'),
                payment_methods: toArray('payment_methods'),
                advance_purchase_required: formData.get('advance_purchase_required') === 'on',
                official_booking_url: formData.get('official_booking_url'),
                fullrefund_before_day: Number(formData.get('fullrefund_before_day')) || 0,
                currency: "JPY"
            },

            // SECTION 5: SCHEDULE
            schedule: {
                opening_time: formData.get('opening_time'),
                closing_time: formData.get('closing_time'),
                last_entry_time: formData.get('last_entry_time'),
                is_24_hours: formData.get('is_24_hours') === 'on',
                regular_closed_days: toArray('regular_closed_days'),
                seasonal_opening_notes: formData.get('opening_days'),
                entry_system: formData.get('entry_system')
            },

            // SECTION 6: FACILITIES
            facilities: {
                wheelchair_access_level: formData.get('wheelchair_access_level'),
                elevator_availability: formData.get('elevator_availability') === 'on',
                stepless_routes: formData.get('stepless_routes') === 'on',
                rental_mobility_aids: toArray('rental_mobility_aids'),
                vegetarian_vegan_options: formData.get('vegetarian_vegan_options') === 'on',
                audio_guide_languages: toArray('audio_guide_languages'),
                photography_allowed: formData.get('photography_allowed') === 'on'
            },

            // SECTION 7: SEASONAL
            seasonal: {
                sakura: {
                    is_spot: formData.get('is_sakura_spot') === 'on',
                    peak_window: formData.get('peak_bloom_window')
                },
                koyo: {
                    is_spot: formData.get('is_koyo_spot') === 'on',
                    peak_window: formData.get('peak_foliage_window')
                },
                winter: {
                    is_snow_spot: formData.get('is_snow_spot') === 'on',
                    peak_snow_window: formData.get('peak_snow_window')
                },
                special_events: {
                    has_event: formData.get('has_event') === 'on',
                    name: formData.get('event_name'),
                    range: {
                        start: formData.get('event_start'),
                        end: formData.get('event_end')
                    }
                },
                night_light_up: formData.get('night_light_up') === 'on'
            },

            // SECTION 8: SOCIALS
            socials: {
                official_website_en: formData.get('official_website_en'),
                official_website_jp: formData.get('official_website_jp'),
                instagram: formData.get('instagram'),
                line_official_account: formData.get('line_account'),
                phone_number: formData.get('phone_number'),
                phone_support_languages: toArray('phone_support_languages'),
                email_inquiry: formData.get('email_inquiry'),
                emergency_contact: formData.get('emergency_contact')
            },

            // SECTION 9: CROWD & VIBE
            vibe: {
                average_daily_visitors: Number(formData.get('average_daily_visitors')) || 0,
                peak_hours: toArray('peak_hours'),
                best_time_to_avoid_crowds: formData.get('avoid_crowds'),
                vibe_primary: formData.get('vibe_primary'),
                target_audience: toArray('target_audience')
            }
        };

        // Save to MongoDB
        await Sightseeing.create(finalData);

        // Refresh the page data
        revalidatePath('/add-sightseeings');
        
        console.log("✅ Successfully synced to Atlas Cloud");
        return { success: true };

    } catch (error) {
        console.error("❌ Action Error:", error);
        return { success: false, error: error.message };
    }
}