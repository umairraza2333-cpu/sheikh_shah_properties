export type UserRole = 'buyer' | 'agent' | 'admin';

export interface User {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  userType: 'buyer' | 'agent' | null;
  isTrialActive: boolean;
  isPremium: boolean;
  trialEndDate: Date | null;
  subscriptionStatus: 'active' | 'inactive' | 'expired' | 'cancelled';
  companyName: string | null;
  phone: string | null;
  address: string | null;
  profileImage: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePermissions {
  canViewProperties: boolean;
  canSearchProperties: boolean;
  canViewPropertyDetails: boolean;
  canContactAgent: boolean;
  canSaveProperties: boolean;
  canPostProperties: boolean;
  canEditProperties: boolean;
  canDeleteProperties: boolean;
  canAccessAgentDashboard: boolean;
  canAccessAdminPanel: boolean;
  canUploadImages: boolean;
  canManageSubscription: boolean;
}

/**
 * Get permissions based on user role
 */
export function getRolePermissions(role: UserRole | null | undefined): RolePermissions {
  const defaultPermissions: RolePermissions = {
    canViewProperties: false,
    canSearchProperties: false,
    canViewPropertyDetails: false,
    canContactAgent: false,
    canSaveProperties: false,
    canPostProperties: false,
    canEditProperties: false,
    canDeleteProperties: false,
    canAccessAgentDashboard: false,
    canAccessAdminPanel: false,
    canUploadImages: false,
    canManageSubscription: false,
  };

  if (!role) return defaultPermissions;

  switch (role) {
    case 'buyer':
      return {
        ...defaultPermissions,
        canViewProperties: true,
        canSearchProperties: true,
        canViewPropertyDetails: true,
        canContactAgent: true,
        canSaveProperties: true,
      };

    case 'agent':
      return {
        ...defaultPermissions,
        canViewProperties: true,
        canSearchProperties: true,
        canViewPropertyDetails: true,
        canContactAgent: true,
        canSaveProperties: true,
        canPostProperties: true,
        canEditProperties: true,
        canDeleteProperties: true,
        canAccessAgentDashboard: true,
        canUploadImages: true,
        canManageSubscription: true,
      };

    case 'admin':
      return {
        ...defaultPermissions,
        canViewProperties: true,
        canSearchProperties: true,
        canViewPropertyDetails: true,
        canContactAgent: true,
        canSaveProperties: true,
        canPostProperties: true,
        canEditProperties: true,
        canDeleteProperties: true,
        canAccessAgentDashboard: true,
        canAccessAdminPanel: true,
        canUploadImages: true,
        canManageSubscription: true,
      };

    default:
      return defaultPermissions;
  }
}

/**
 * Check if user is trial active
 */
export function isTrialActive(user: User | null | undefined): boolean {
  if (!user) return false;
  if (user.role !== 'agent') return false;

  const trialEndDate = user.trialEndDate ? new Date(user.trialEndDate) : null;
  if (!trialEndDate) return false;

  return trialEndDate > new Date();
}

/**
 * Get days remaining in trial
 */
export function getTrialDaysRemaining(user: User | null | undefined): number {
  if (!user) return 0;

  const trialEndDate = user.trialEndDate ? new Date(user.trialEndDate) : null;
  if (!trialEndDate) return 0;

  const now = new Date();
  const daysRemaining = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return Math.max(0, daysRemaining);
}

/**
 * Check if agent can post properties
 */
export function canAgentPostProperties(user: User | null | undefined): boolean {
  if (!user || user.role !== 'agent') return false;

  // Can post if trial is active OR premium subscription is active
  return isTrialActive(user) || user.isPremium;
}

/**
 * Get trial status message
 */
export function getTrialStatusMessage(user: User | null | undefined): string {
  if (!user || user.role !== 'agent') return '';

  if (!user.isTrialActive && !user.isPremium) {
    return 'Trial expired. Subscribe to continue posting properties.';
  }

  if (isTrialActive(user)) {
    const daysRemaining = getTrialDaysRemaining(user);
    return `${daysRemaining} days remaining in your free trial`;
  }

  if (user.isPremium) {
    return 'Premium subscription active';
  }

  return '';
}
