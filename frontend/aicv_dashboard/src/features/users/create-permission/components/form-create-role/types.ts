export type PermissionAction = 'read' | 'create' | 'update' | 'delete' | 'import' | 'export';

export interface IPermissionModule {
    [moduleName: string]: PermissionAction[];
}

export interface IPermissionData {
    [sectionName: string]: IPermissionModule;
}

export interface IPermissionMatrixProps {
    data?: IPermissionData;
    onDataChange?: (data: IPermissionData) => void;
}
