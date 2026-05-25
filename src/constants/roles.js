export const ROLE_CODES = {
  SYSTEM_ADMIN: 'system_admin',
  MINISTRY_MANAGER: 'ministry_manager',
  DEPARTMENT_MANAGER: 'department_manager',
  SPOT_OPERATOR: 'spot_operator',
  TRAVEL_COMPANY: 'travel_company',
  SERVICE_PROVIDER: 'service_provider',
  TOURIST: 'tourist',
};

export const ADMIN_ROLE_CODES = [
  ROLE_CODES.SYSTEM_ADMIN,
  ROLE_CODES.MINISTRY_MANAGER,
  ROLE_CODES.DEPARTMENT_MANAGER,
];

export const PROVIDER_ROLE_CODES = [
  ROLE_CODES.SPOT_OPERATOR,
  ROLE_CODES.TRAVEL_COMPANY,
  ROLE_CODES.SERVICE_PROVIDER,
];

export const TOURIST_ROLE_CODES = [
  ROLE_CODES.TOURIST,
];
