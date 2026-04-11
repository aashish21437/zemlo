'use server'

import { dbConnect } from '@/lib/db';
import Sightseeing from '@/models/Sightseeing';
import { revalidatePath } from 'next/cache';

// Define a response type for the client
export type ActionResponse = {
    success: boolean;
    error?: string;
};

export async function addSightseeing(formData: FormData): Promise<ActionResponse> {
    await dbConnect();

    // Helper: Converts "Tag 1, Tag 2" into ["Tag 1", "Tag 2"]
    const toArray = (fieldName: string): string[] => {
        const value = formData.get(fieldName) as string;
        if (!value) return [];
        return value.split(',').map(item => item.trim()).filter(item => item !== "");
    };

    // Helper: Safely parse numbers
    const toNumber = (fieldName: string): number => {
        const val = formData.get(fieldName);
        return val ? Number(val) : 0;
    };

    // Helper: Safely parse floats
    const toFloat = (fieldName: string): number => {
        const val = formData.get(fieldName);
        return val ? parseFloat(val as string) : 0;
    };

    try {
        const finalData = {
            // SECTION 1: WHO / WHAT
            who_what: {
                name_en: formData.get('name_en') as string,
                aliases: toArray('aliases'),
                category_primary: formData.get('category_primary') as string,
                category_tags: toArray('category_tags'),
                year_founded: formData.get('year_founded') as string,
                government_status: formData.get('government_status') as string,
                unesco_status: formData.get('unesco_status') === 'on',
                tagline: formData.get('tagline') as string,
                description_short: formData.get('description_short') as string,
                description_long: formData.get('description_long') as string,
                spot_id: formData.get('spot_id') as string,
                external_id_google: formData.get('external_id_google') as string,
                media: {
                    primary_photo_url: formData.get('primary_photo_url') as string,
                    gallery_urls: toArray('gallery_urls'),
                    external_page_urls: toArray('external_page_urls')
                }
            },

            // SECTION 2: WHERE
            where: {
                hierarchy: {
                    prefecture: formData.get('prefecture') as string,
                    municipality: formData.get('municipality') as string,
                    neighborhood: formData.get('neighborhood') as string,
                    block_number: formData.get('block_number') as string
                },
                address: {
                    postal_code: formData.get('postal_code') as string,
                    en: formData.get('address_full_en') as string
                },
                location: {
                    type: "Point" as const,
                    coordinates: [
                        toFloat('lng'), 
                        toFloat('lat')
                    ]
                },
                plus_code: formData.get('plus_code') as string,
                elevation_meters: toNumber('elevation_meters')
            },

            // SECTION 3: HOW
            how: {
                rail: {
                    station_names_codes: formData.get('station_names_codes') as string,
                    recommended_exit_gate: formData.get('recommended_exit_gate') as string,
                    walk_time_min: toNumber('walk_time_min')
                },
                bus: {
                    bus_stop_name: formData.get('bus_stop_name') as string
                },
                road: {
                    parking_available: formData.get('parking_available') === 'on',
                    parking_fees: formData.get('parking_fees') as string,
                    taxi_drop_off_point: formData.get('taxi_lng') && formData.get('taxi_lat') ? {
                        type: "Point" as const,
                        coordinates: [toFloat('taxi_lng'), toFloat('taxi_lat')]
                    } : null
                }
            },

            // SECTION 4: TICKETING
            ticketing: {
                pricing: {
                    adult: toNumber('adult_price'),
                    senior: toNumber('senior_price'),
                    high_school: toNumber('student_high_school_price'),
                    middle_school: toNumber('student_middle_school_price'),
                    elementary: toNumber('student_elementary_price'),
                    infant: toNumber('infant_child_price')
                },
                is_dynamic_pricing: formData.get('is_dynamic_pricing') === 'on',
                weekday_price: toNumber('weekday_price'),
                weekend_holiday_price: toNumber('weekend_holiday_price'),
                group_discount_min_size: toNumber('group_discount_min_size'),
                group_rate_per_person: toNumber('group_rate_per_person'),
                membership_benefits: toArray('membership_benefits'),
                payment_methods: toArray('payment_methods'),
                advance_purchase_required: formData.get('advance_purchase_required') === 'on',
                official_booking_url: formData.get('official_booking_url') as string,
                fullrefund_before_day: toNumber('fullrefund_before_day'),
                currency: "JPY"
            },

            // SECTION 5: SCHEDULE
            schedule: {
                opening_time: formData.get('opening_time') as string,
                closing_time: formData.get('closing_time') as string,
                last_entry_time: formData.get('last_entry_time') as string,
                is_24_hours: formData.get('is_24_hours') === 'on',
                regular_closed_days: toArray('regular_closed_days'),
                seasonal_opening_notes: formData.get('opening_days') as string,
                entry_system: formData.get('entry_system') as string
            },

            // SECTION 6: FACILITIES
            facilities: {
                wheelchair_access_level: formData.get('wheelchair_access_level') as string,
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
                    peak_window: formData.get('peak_bloom_window') as string
                },
                koyo: {
                    is_spot: formData.get('is_koyo_spot') === 'on',
                    peak_window: formData.get('peak_foliage_window') as string
                },
                winter: {
                    is_snow_spot: formData.get('is_snow_spot') === 'on',
                    peak_snow_window: formData.get('peak_snow_window') as string
                },
                special_events: {
                    has_event: formData.get('has_event') === 'on',
                    name: formData.get('event_name') as string,
                    range: {
                        start: formData.get('event_start') as string,
                        end: formData.get('event_end') as string
                    }
                },
                night_light_up: formData.get('night_light_up') === 'on'
            },

            // SECTION 8: SOCIALS
            socials: {
                official_website_en: formData.get('official_website_en') as string,
                official_website_jp: formData.get('official_website_jp') as string,
                instagram: formData.get('instagram') as string,
                line_official_account: formData.get('line_account') as string,
                phone_number: formData.get('phone_number') as string,
                phone_support_languages: toArray('phone_support_languages'),
                email_inquiry: formData.get('email_inquiry') as string,
                emergency_contact: formData.get('emergency_contact') as string
            },

            // SECTION 9: CROWD & VIBE
            vibe: {
                average_daily_visitors: toNumber('average_daily_visitors'),
                peak_hours: toArray('peak_hours'),
                best_time_to_avoid_crowds: formData.get('avoid_crowds') as string,
                vibe_primary: formData.get('vibe_primary') as string,
                target_audience: toArray('target_audience')
            }
        };

        await Sightseeing.create(finalData);
        revalidatePath('/add-sightseeings');
        
        return { success: true };

    } catch (error: any) {
        console.error("❌ Action Error:", error);
        return { success: false, error: error.message };
    }
}