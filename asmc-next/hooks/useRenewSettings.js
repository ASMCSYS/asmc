import { useGetSettingsQuery } from "@/redux/common/commonApis";
import { useMemo } from "react";

export const useRenewSettings = () => {
    const { data: settingsData, isLoading, error } = useGetSettingsQuery();

    console.log(settingsData, "settingsData");

    const renewSettings = useMemo(() => {
        const defaultSettings = {
            // Activity renew defaults
            activity_renew_start_days: 30,
            activity_renew_end_days: 15,
            // Membership renew defaults
            membership_renew_start_days: 30,
            membership_renew_end_days: 15,
        };

        if (!settingsData?.json) {
            return defaultSettings;
        }

        return {
            // Activity renew settings
            activity_renew_start_days: settingsData.json.activity_renew_start_days,
            activity_renew_end_days: settingsData.json.activity_renew_end_days,
            // Membership renew settings
            membership_renew_start_days: settingsData.json.membership_renew_start_days,
            membership_renew_end_days: settingsData.json.membership_renew_end_days,
        };
    }, [settingsData]);

    return {
        renewSettings,
        isLoading,
        error,
    };
};
