/*
Below are a few example of return codes you may get. This list is not exhaustive.

success: returned when JSON file was generated successfully.
call_limit_reached: returned when minute/monthly limit is reached.
api_key_expired: returned when API key is expired.
incorrect_api_key: returned when using wrong API key.
ip_location_failed: returned when service is unable to locate IP address of request.
no_nearest_station: returned when there is no nearest station within specified radius.
feature_not_available: returned when call requests a feature that is not available in chosen subscription plan.
too_many_requests: returned when more than 10 calls per second are made.

*/
export enum AirQualityAPICodesEnum {
  Success = 'success',
  Fail = 'fail',
  CallLimitReached = 'call_limit_reached',
  ApiKeyExpired = 'api_key_expired',
  IncorrectApiKey = 'incorrect_api_key',
  FeatureNotAvailable = 'feature_not_available',
  TooManyRequests = 'too_many_requests',
}
