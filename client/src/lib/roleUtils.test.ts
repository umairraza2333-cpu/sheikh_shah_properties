import { describe, expect, it } from 'vitest';
import { getRolePermissions, isTrialActive, getTrialDaysRemaining, canAgentPostProperties, getTrialStatusMessage } from './roleUtils';
import type { User } from './roleUtils';

describe('roleUtils', () => {
  describe('getRolePermissions', () => {
    it('should return default permissions for null role', () => {
      const permissions = getRolePermissions(null);
      expect(permissions.canViewProperties).toBe(false);
      expect(permissions.canPostProperties).toBe(false);
      expect(permissions.canAccessAdminPanel).toBe(false);
    });

    it('should return buyer permissions for buyer role', () => {
      const permissions = getRolePermissions('buyer');
      expect(permissions.canViewProperties).toBe(true);
      expect(permissions.canSearchProperties).toBe(true);
      expect(permissions.canSaveProperties).toBe(true);
      expect(permissions.canPostProperties).toBe(false);
      expect(permissions.canAccessAdminPanel).toBe(false);
    });

    it('should return agent permissions for agent role', () => {
      const permissions = getRolePermissions('agent');
      expect(permissions.canViewProperties).toBe(true);
      expect(permissions.canPostProperties).toBe(true);
      expect(permissions.canEditProperties).toBe(true);
      expect(permissions.canDeleteProperties).toBe(true);
      expect(permissions.canAccessAgentDashboard).toBe(true);
      expect(permissions.canAccessAdminPanel).toBe(false);
    });

    it('should return admin permissions for admin role', () => {
      const permissions = getRolePermissions('admin');
      expect(permissions.canViewProperties).toBe(true);
      expect(permissions.canPostProperties).toBe(true);
      expect(permissions.canAccessAdminPanel).toBe(true);
      expect(permissions.canAccessAgentDashboard).toBe(true);
    });
  });

  describe('isTrialActive', () => {
    it('should return false for null user', () => {
      expect(isTrialActive(null)).toBe(false);
    });

    it('should return false for buyer user', () => {
      const buyer: User = {
        id: 1,
        openId: 'buyer-1',
        name: 'John Buyer',
        email: 'buyer@example.com',
        role: 'buyer',
        userType: 'buyer',
        isTrialActive: false,
        isPremium: false,
        trialEndDate: null,
        subscriptionStatus: 'inactive',
        companyName: null,
        phone: null,
        address: null,
        profileImage: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(isTrialActive(buyer)).toBe(false);
    });

    it('should return true for agent with active trial', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const agent: User = {
        id: 2,
        openId: 'agent-1',
        name: 'John Agent',
        email: 'agent@example.com',
        role: 'agent',
        userType: 'agent',
        isTrialActive: true,
        isPremium: false,
        trialEndDate: futureDate,
        subscriptionStatus: 'inactive',
        companyName: 'My Real Estate',
        phone: '03001234567',
        address: 'Karachi',
        profileImage: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(isTrialActive(agent)).toBe(true);
    });

    it('should return false for agent with expired trial', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const agent: User = {
        id: 3,
        openId: 'agent-2',
        name: 'Jane Agent',
        email: 'jane@example.com',
        role: 'agent',
        userType: 'agent',
        isTrialActive: false,
        isPremium: false,
        trialEndDate: pastDate,
        subscriptionStatus: 'inactive',
        companyName: 'Jane Properties',
        phone: '03009876543',
        address: 'Karachi',
        profileImage: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(isTrialActive(agent)).toBe(false);
    });
  });

  describe('getTrialDaysRemaining', () => {
    it('should return 0 for null user', () => {
      expect(getTrialDaysRemaining(null)).toBe(0);
    });

    it('should return correct days remaining', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15);

      const agent: User = {
        id: 4,
        openId: 'agent-3',
        name: 'Test Agent',
        email: 'test@example.com',
        role: 'agent',
        userType: 'agent',
        isTrialActive: true,
        isPremium: false,
        trialEndDate: futureDate,
        subscriptionStatus: 'inactive',
        companyName: 'Test Properties',
        phone: '03001111111',
        address: 'Karachi',
        profileImage: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const daysRemaining = getTrialDaysRemaining(agent);
      expect(daysRemaining).toBeGreaterThanOrEqual(14);
      expect(daysRemaining).toBeLessThanOrEqual(15);
    });
  });

  describe('canAgentPostProperties', () => {
    it('should return false for null user', () => {
      expect(canAgentPostProperties(null)).toBe(false);
    });

    it('should return false for buyer', () => {
      const buyer: User = {
        id: 5,
        openId: 'buyer-2',
        name: 'Buyer Test',
        email: 'buyer2@example.com',
        role: 'buyer',
        userType: 'buyer',
        isTrialActive: false,
        isPremium: false,
        trialEndDate: null,
        subscriptionStatus: 'inactive',
        companyName: null,
        phone: null,
        address: null,
        profileImage: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(canAgentPostProperties(buyer)).toBe(false);
    });

    it('should return true for agent with active trial', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);

      const agent: User = {
        id: 6,
        openId: 'agent-4',
        name: 'Active Agent',
        email: 'active@example.com',
        role: 'agent',
        userType: 'agent',
        isTrialActive: true,
        isPremium: false,
        trialEndDate: futureDate,
        subscriptionStatus: 'inactive',
        companyName: 'Active Properties',
        phone: '03002222222',
        address: 'Karachi',
        profileImage: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(canAgentPostProperties(agent)).toBe(true);
    });

    it('should return true for premium agent', () => {
      const agent: User = {
        id: 7,
        openId: 'agent-5',
        name: 'Premium Agent',
        email: 'premium@example.com',
        role: 'agent',
        userType: 'agent',
        isTrialActive: false,
        isPremium: true,
        trialEndDate: null,
        subscriptionStatus: 'active',
        companyName: 'Premium Properties',
        phone: '03003333333',
        address: 'Karachi',
        profileImage: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(canAgentPostProperties(agent)).toBe(true);
    });
  });

  describe('getTrialStatusMessage', () => {
    it('should return empty string for null user', () => {
      expect(getTrialStatusMessage(null)).toBe('');
    });

    it('should return trial expired message', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const agent: User = {
        id: 8,
        openId: 'agent-6',
        name: 'Expired Agent',
        email: 'expired@example.com',
        role: 'agent',
        userType: 'agent',
        isTrialActive: false,
        isPremium: false,
        trialEndDate: pastDate,
        subscriptionStatus: 'inactive',
        companyName: 'Expired Properties',
        phone: '03004444444',
        address: 'Karachi',
        profileImage: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(getTrialStatusMessage(agent)).toBe('Trial expired. Subscribe to continue posting properties.');
    });

    it('should return days remaining message for active trial', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);

      const agent: User = {
        id: 9,
        openId: 'agent-7',
        name: 'Trial Agent',
        email: 'trial@example.com',
        role: 'agent',
        userType: 'agent',
        isTrialActive: true,
        isPremium: false,
        trialEndDate: futureDate,
        subscriptionStatus: 'inactive',
        companyName: 'Trial Properties',
        phone: '03005555555',
        address: 'Karachi',
        profileImage: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const message = getTrialStatusMessage(agent);
      expect(message).toContain('days remaining in your free trial');
    });

    it('should return premium message for premium agent', () => {
      const agent: User = {
        id: 10,
        openId: 'agent-8',
        name: 'Premium Agent 2',
        email: 'premium2@example.com',
        role: 'agent',
        userType: 'agent',
        isTrialActive: false,
        isPremium: true,
        trialEndDate: null,
        subscriptionStatus: 'active',
        companyName: 'Premium Properties 2',
        phone: '03006666666',
        address: 'Karachi',
        profileImage: null,
        bio: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(getTrialStatusMessage(agent)).toBe('Premium subscription active');
    });
  });
});
