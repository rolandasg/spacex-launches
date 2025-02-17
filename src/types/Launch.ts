export interface Launch {
  flight_number: number;
  mission_name: string;
  mission_id: string[];
  launch_year: string;
  launch_date_unix: number;
  launch_date_utc: string;
  launch_date_local: string;
  is_tentative: boolean;
  tentative_max_precision: string;
  tbd: boolean;
  launch_window: number | null;
  rocket: Rocket;
  ships: string[];
  telemetry: {
    flight_club: string | null;
  };
  launch_site: LaunchSite;
  launch_success: boolean | null;
  links: Links;
  details: string | null;
  upcoming: boolean;
  static_fire_date_utc: string | null;
  static_fire_date_unix: number | null;
  timeline: any | null;
  crew: any | null;
  last_date_update: string;
  last_ll_launch_date: string | null;
  last_ll_update: string | null;
  last_wiki_launch_date: string;
  last_wiki_revision: string;
  last_wiki_update: string;
  launch_date_source: string;
}

interface Rocket {
  rocket_id: string;
  rocket_name: string;
  rocket_type: string;
  first_stage: FirstStage;
  second_stage: SecondStage;
  fairings: Fairings | null;
  cost_per_launch?: number | string;
}

interface FirstStage {
  cores: Core[];
}

interface Core {
  core_serial: string | null;
  flight: number | null;
  block: number | null;
  gridfins: boolean | null;
  legs: boolean | null;
  reused: boolean | null;
  land_success: boolean | null;
  landing_intent: boolean | null;
  landing_type: string | null;
  landing_vehicle: string | null;
}

interface SecondStage {
  block: number;
  payloads: Payload[];
}

export interface Payload {
  payload_id: string;
  norad_id: number[];
  reused: boolean;
  customers: string[];
  nationality: string;
  manufacturer: string;
  payload_type: string;
  payload_mass_kg: number | null;
  payload_mass_lbs: number | null;
  orbit: string;
  orbit_params: OrbitParams;
}

interface OrbitParams {
  reference_system: string;
  regime: string;
  longitude: number | null;
  semi_major_axis_km: number | null;
  eccentricity: number | null;
  periapsis_km: number | null;
  apoapsis_km: number | null;
  inclination_deg: number | null;
  period_min: number | null;
  lifespan_years: number | null;
  epoch: string | null;
  mean_motion: number | null;
  raan: number | null;
  arg_of_pericenter: number | null;
  mean_anomaly: number | null;
}

interface Fairings {
  reused: boolean | null;
  recovery_attempt: boolean | null;
  recovered: boolean | null;
  ship: string | null;
}

interface LaunchSite {
  site_id: string;
  site_name: string;
  site_name_long: string;
}

interface Links {
  mission_patch: string | null;
  mission_patch_small: string | null;
  reddit_campaign: string | null;
  reddit_launch: string | null;
  reddit_recovery: string | null;
  reddit_media: string | null;
  presskit: string | null;
  article_link: string | null;
  wikipedia: string | null;
  video_link: string | null;
  youtube_id: string | null;
  flickr_images: string[];
}
