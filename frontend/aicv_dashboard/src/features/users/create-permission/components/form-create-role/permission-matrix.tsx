import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import Column from 'src/components/common/column';
import Row from 'src/components/common/row';
import { pxToRem } from 'src/theme/styles';
import { BaseAccordion } from 'src/components/common/base-accordion/base-accordion';
import CheckBox from 'src/components/check-box/check-box';
import type { IPermissionMatrixProps, IPermissionData, PermissionAction } from './types';

// Define all possible actions for each module
const MODULE_ACTIONS: Record<string, Record<string, PermissionAction[]>> = {
    Users: {
        'User Management': ['read', 'create', 'update', 'delete'],
        'Permission Management': ['read', 'create', 'update', 'delete'],
        Branch: ['read', 'import', 'update'],
        Region: ['read', 'create', 'update', 'delete', 'import', 'export'],
    },
    'People Counting': {
        'Data Overview': ['read', 'export'],
        'Visitor traffic': ['read', 'export'],
        'Zone traffic': ['read', 'export'],
        'Transaction and Interaction': ['read', 'export'],
    },
    Settings: {
        'User Management': ['read', 'export'],
        'Profile Management': ['read', 'export'],
    },
};

export function PermissionMatrix({
    data,
    onDataChange,
}: IPermissionMatrixProps) {
    const [permissions, setPermissions] = useState<IPermissionData>(data ?? {});

    // Sync local state with prop changes
    useEffect(() => {
        setPermissions(data ?? {});
    }, [data]);

    const handleTogglePermission = (
        section: string,
        module: string,
        action: PermissionAction,
        checked: boolean
    ) => {
        const currentPermissions = permissions[section]?.[module] || [];
        const updatedPermissions = checked
            ? [...currentPermissions, action]
            : currentPermissions.filter((a) => a !== action);

        const newPermissions = {
            ...permissions,
            [section]: {
                ...permissions[section],
                [module]: updatedPermissions,
            },
        };
        setPermissions(newPermissions);
        onDataChange?.(newPermissions);
    };

    const handleSelectAll = (section: string, checked: boolean) => {
        const updatedSection: Record<string, PermissionAction[]> = {};
        const sectionModules = MODULE_ACTIONS[section] || {};
        
        Object.keys(sectionModules).forEach((module) => {
            updatedSection[module] = checked ? [...sectionModules[module]] : [];
        });

        const updatedPermissions = {
            ...permissions,
            [section]: updatedSection,
        };
        setPermissions(updatedPermissions);
        onDataChange?.(updatedPermissions);
    };

    const isSectionFullySelected = (section: string): boolean => {
        const sectionData = permissions[section];
        const sectionModules = MODULE_ACTIONS[section];
        if (!sectionData || !sectionModules) return false;

        return Object.entries(sectionModules).every(([module, availableActions]) => {
            const modulePermissions = sectionData[module] || [];
            return availableActions.every((action) => modulePermissions.includes(action));
        });
    };

    const formatActionName = (action: string): string => {
        return action.charAt(0).toUpperCase() + action.slice(1);
    };

    const formatModuleName = (module: string): string => {
        return module
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    return (
        <BaseAccordion>
            <Column gap={pxToRem(40)}>
                {Object.entries(MODULE_ACTIONS).map(([sectionName, modules]) => {
                    const isAllSelected = isSectionFullySelected(sectionName);

                    return (
                        <Column key={sectionName} gap={pxToRem(16)}>
                            {/* Section Header */}
                            <Row
                                alignItems='center'
                                justifyContent='space-between'
                                sx={{
                                    borderBottom: (theme) =>
                                        `1px solid ${theme.palette.neutral[30]}`,
                                    paddingBottom: pxToRem(16),
                                }}
                            >
                                <Typography variant='h4' color='purple.80'>
                                    {sectionName}
                                </Typography>
                                <Row alignItems='center' gap={pxToRem(8)}>
                                    <CheckBox
                                        checked={isAllSelected}
                                        onChange={(_, checked) =>
                                            handleSelectAll(sectionName, checked)
                                        }
                                    />
                                    <Typography variant='b3Regular' color='neutral.100'>
                                        Select all
                                    </Typography>
                                </Row>
                            </Row>

                            {/* Permission List */}
                            <Column gap={pxToRem(12)}>
                                {Object.entries(modules).map(([moduleName, availableActions]) => {
                                    const modulePermissions = permissions[sectionName]?.[moduleName] || [];
                                    
                                    return (
                                        <Row
                                            key={moduleName}
                                            alignItems='center'
                                            sx={{
                                                padding: pxToRem(16),
                                                backgroundColor: 'white',
                                            }}
                                            gap={pxToRem(20)}
                                        >
                                            <Typography
                                                variant='t2SemiBold'
                                                color='neutral.100'
                                                width={pxToRem(362)}
                                            >
                                                {formatModuleName(moduleName)}
                                            </Typography>
                                            <Row gap={pxToRem(24)} alignItems='center'>
                                                {availableActions.map((action) => {
                                                    const isChecked = modulePermissions.includes(action);
                                                    return (
                                                        <Row
                                                            key={action}
                                                            alignItems='center'
                                                            gap={pxToRem(8)}
                                                            width={pxToRem(100)}
                                                            onClick={() =>
                                                                handleTogglePermission(
                                                                    sectionName,
                                                                    moduleName,
                                                                    action,
                                                                    !isChecked
                                                                )
                                                            }
                                                            sx={{
                                                                cursor: 'pointer',
                                                                userSelect: 'none',
                                                            }}
                                                        >
                                                            <CheckBox
                                                                checked={isChecked}
                                                                onChange={(_, checked) =>
                                                                    handleTogglePermission(
                                                                        sectionName,
                                                                        moduleName,
                                                                        action,
                                                                        checked
                                                                    )
                                                                }
                                                            />
                                                            <Typography
                                                                variant='b3Regular'
                                                                color='neutral.100'
                                                            >
                                                                {formatActionName(action)}
                                                            </Typography>
                                                        </Row>
                                                    );
                                                })}
                                            </Row>
                                        </Row>
                                    );
                                })}
                            </Column>
                        </Column>
                    );
                })}
            </Column>
        </BaseAccordion>
    );
}
