import React from 'react';

export type AppRole = 
  | 'SUPER_ADMIN'
  | 'ADMIN_SOCIETE'
  | 'GESTIONNAIRE_TECHNIQUE'
  | 'VALIDEUR'
  | 'UTILISATEUR'
  | 'AUDITEUR';

// Mock hook - in a real app, this would read from a UserContext or JWT token
export function usePermissions() {
  // Hardcoded for demonstration purposes
  const currentRole = 'ADMIN_SOCIETE' as AppRole;

  const hasRole = (allowedRoles: AppRole[]) => {
    // SUPER_ADMIN typically has all permissions
    if (currentRole === 'SUPER_ADMIN') return true;
    return allowedRoles.includes(currentRole);
  };

  return { currentRole, hasRole };
}

interface PermissionGuardProps {
  allowedRoles: AppRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ allowedRoles, children, fallback = null }: PermissionGuardProps) {
  const { hasRole } = usePermissions();

  if (!hasRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
