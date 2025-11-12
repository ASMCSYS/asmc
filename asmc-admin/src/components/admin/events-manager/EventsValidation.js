import * as yup from "yup";

export const EventsValidation = yup.object().shape({
    images: yup.mixed().required("Required"),
    event_name: yup.mixed().required("Required"),
    location_id: yup.mixed().required("Required"),
    description: yup.mixed().required("Required"),
    event_start_date: yup.mixed().required("Required"),
    event_end_date: yup.mixed().required("Required"),
    event_start_time: yup.mixed().required("Required"),
    event_end_time: yup.mixed().required("Required"),

    registration_start_date: yup.mixed().required("Required"),
    registration_end_date: yup.mixed().required("Required"),
    registration_start_time: yup.mixed().required("Required"),
    registration_end_time: yup.mixed().required("Required"),

    event_type: yup.mixed().required("Required"),
    members_type: yup.mixed().required("Required"),
    players_limit: yup.mixed(),
    min_players_limit: yup.mixed(),
    member_team_event_price: yup.mixed(),
    non_member_team_event_price: yup.mixed(),

    // event_type === team then mark the players_limit, min_players_limit and team_event_price required
});

export const CategoryValidation = yup.object().shape({
    category_name: yup.mixed().required("Required"),
    // start_age: yup.mixed(),
    // end_age: yup.mixed(),
    // male_allowed: yup.mixed(),
    // female_allowed: yup.mixed(),
    // distance: yup.mixed(),
    // belts: yup.mixed(),
    // members_fees: yup.mixed(),
    // non_members_fees: yup.mixed(),
});
