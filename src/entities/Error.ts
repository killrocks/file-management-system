export enum IErrorEnum {
    AuthLoginNotFound = 100,
    AuthLoginInvalidPassword = 101,

    CreateProjectProposalInvalidMediaType = 200,
    CreateProjectNoProjectsCreated = 201,

    EditProjectInvalidID = 300,
    EditProjectNoProjectsUpdated = 301,

    GetProjectCollectionNoProjectsFound = 400,
    GetProjectSearchKeywordUndefined = 401,
    GetProjectMoreThanOneFilter = 402,
    GetProjectInvalidDateFilter = 403,

    DeleteProjectInvalidID = 450,
    DeleteProjectProjectFailedToDelete = 451,

    CreateMaintenanceNoCollectionCreated = 500,
    CreateMaintenanceInvalidMonth = 501,

    EditMaintenanceInvalidId = 600,
    EditMaintenanceFailedToEditMaintenance = 601,
    EditMaintenanceInvalidMonth = 602,

    GetMaintenanceNoMaintenanceFound = 700,
    GetMaintenanceMoreThanOneFilter = 701,
    GetMaintenanceInvalidDateFilter = 702,

    DeleteMaintenanceInvalidId = 800,
    DeleteMaintenanceFailedToDeleteMaintenance = 801,

    ValidationError = 9991,
    UnknownError = 9999,
}
