import {useGetSettings} from './useCommon';

export const useRenewSettings = () => {
  const {data: settingsData, isLoading, error} = useGetSettings();

  const renewSettings = {
    // Activity renew settings
    activity_renew_start_days:
      settingsData?.result?.json?.activity_renew_start_days,
    activity_renew_end_days:
      settingsData?.result?.json?.activity_renew_end_days,
    // Membership renew settings
    membership_renew_start_days:
      settingsData?.result?.json?.membership_renew_start_days,
    membership_renew_end_days:
      settingsData?.result?.json?.membership_renew_end_days,
  };

  return {
    renewSettings,
    isLoading,
    error,
  };
};
