import mongoose, { Date, HydratedDocument, LeanDocument } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { ServiceResponse, ServiceResponseStatus } from './types';
import { IErrorEnum } from '~entities/Error';
import servicesLib from '~lib/error';
import Project from '~models/Project';
import config from '~config';
import { GetProjectResponse, IProject, IServerProject } from '~entities/Project';

dayjs.extend(utc);

export default class ProjectService {
    async CreateProject(quotationName: string, proposalName: string, date: Date, customerName: string, contractAmount: number, standardArr: [string], remarks: string): ServiceResponse<string> {
        try {
            const filePath = config.fileUploadPath.replace('public/', '');
            const proposalImageUrl = `${filePath}${proposalName}`;
            const quotationImageUrl = `${filePath}${quotationName}`;

            let ProjectDetails = {};

            if (proposalName === '' && quotationName) {
                ProjectDetails = {
                    quotationImageUrl,
                    date,
                    customerName,
                    standard: standardArr,
                    contractAmount,
                    remarks,
                };
            } else if (quotationName === '' && proposalName) {
                ProjectDetails = {
                    proposalImageUrl,
                    date,
                    customerName,
                    standard: standardArr,
                    contractAmount,
                    remarks,
                };
            } else if (quotationName === '' && proposalName === '') {
                ProjectDetails = {
                    date,
                    customerName,
                    standard: standardArr,
                    contractAmount,
                    remarks,
                };
            } else {
                ProjectDetails = {
                    proposalImageUrl,
                    quotationImageUrl,
                    date,
                    customerName,
                    standard: standardArr,
                    contractAmount,
                    remarks,
                };
            }
            const createProject = await Project.create(ProjectDetails);

            if (!createProject) {
                return servicesLib.generateServiceError(IErrorEnum.CreateProjectNoProjectsCreated, 'No projects created');
            }

            return {
                status: ServiceResponseStatus.Success,
                data: 'OK',
            };
        } catch (err) {
            console.log(err);
            return servicesLib.generateServiceError(IErrorEnum.UnknownError, ' Something went wrong while trying to create project, please try again');
        }
    }

    async EditProject(id: string, proposalName: string, quotationName: string, date: string, standardArr: string[], customerName: string, contractAmount: number, remarks: string): ServiceResponse<string> {
        if (!mongoose.isValidObjectId(id)) {
            return servicesLib.generateServiceError(IErrorEnum.EditProjectInvalidID, ' Invalid ID found');
        }

        try {
            const filePath = config.fileUploadPath.replace('public/', '');
            const proposalImageUrl = `${filePath}${proposalName}`;
            const quotationImageUrl = `${filePath}${quotationName}`;

            let projectDetails = {};

            if (proposalName === '' && quotationName) {
                projectDetails = {
                    quotationImageUrl,
                    date,
                    customerName,
                    standard: standardArr,
                    contractAmount,
                    remarks,
                };
            } else if (quotationName === '' && proposalName) {
                projectDetails = {
                    proposalImageUrl,
                    date,
                    customerName,
                    standard: standardArr,
                    contractAmount,
                    remarks,
                };
            } else if (quotationName === '' && proposalName === '') {
                projectDetails = {
                    date,
                    customerName,
                    standard: standardArr,
                    contractAmount,
                    remarks,
                };
            } else {
                projectDetails = {
                    proposalImageUrl,
                    quotationImageUrl,
                    date,
                    customerName,
                    standard: standardArr,
                    contractAmount,
                    remarks,
                };
            }

            const editProjectDetails: HydratedDocument<IServerProject> = await Project.findByIdAndUpdate(id, {
                $set: projectDetails,
            }).lean().exec();

            if (!editProjectDetails) {
                return servicesLib.generateServiceError(IErrorEnum.EditProjectNoProjectsUpdated, 'Failed to upload project');
            }

            return {
                status: ServiceResponseStatus.Success,
                data: 'OK',
            };
        } catch (err) {
            console.log(err);
            return servicesLib.generateServiceError(IErrorEnum.UnknownError, 'Something went wrong while updating project, please try again');
        }
    }

    async GetAllProjects(index: number, search?: string, dateFilter?: string): ServiceResponse<GetProjectResponse> {
        if (search && dateFilter) {
            return servicesLib.generateServiceError(
                IErrorEnum.GetProjectMoreThanOneFilter,
                'Only one filter is applicable at a time',
            );
        }

        try {
            const page = index || 1;
            const size = 10;
            const limit = size;
            const skip = (page - 1) * size;

            const searchKeyword = search;

            const populateImageUrl = (url: string | undefined) => {
                if (url) return `https://${config.host}/${url}`;
                return url;
            };

            let filterParam = {};

            if (searchKeyword) {
                filterParam = {
                    $and: [{
                        customerName: {
                            $regex: search, $options: 'i',
                        },
                    }, {
                        isDeleted: false,
                    }],
                };
            } else if (dateFilter) {
                const populatedDate = dayjs(`${dateFilter}-01`);

                if (!populatedDate.isValid()) {
                    return servicesLib.generateServiceError(IErrorEnum.GetProjectInvalidDateFilter, 'Invalid date filters');
                }

                const fromDate = populatedDate.startOf('months').utc();
                const toDate = populatedDate.endOf('months').utc();

                filterParam = {
                    $and: [
                        {
                            date: {
                                $gte: fromDate.toDate(),
                                $lt: toDate.toDate(),
                            },
                        }, {
                            isDeleted: false,

                        },
                    ],
                };
            } else {
                filterParam = {
                    isDeleted: false,
                };
            }
            const projectCollectionFromDb: LeanDocument<IServerProject>[] = await Project.find(filterParam)
                .sort('-createdAt')
                .limit(limit)
                .skip(skip)
                .lean()
                .exec();

            const maxIndex = Math.ceil(await Project.countDocuments(filterParam) / limit);

            const output = {
                index,
                maxIndex,
                data: projectCollectionFromDb.map((item) => ({

                    id: item._id,
                    createdAt: item.createdAt,
                    standard: item.standard,
                    customerName: item.customerName,
                    contractAmount: item.contractAmount,
                    date: item.date,
                    proposalImageUrl: populateImageUrl(item.proposalImageUrl),
                    quotationImageUrl: populateImageUrl(item.quotationImageUrl),
                    remarks: item.remarks,
                })),
            };

            return {
                status: ServiceResponseStatus.Success,
                data: output,
            };
        } catch (err) {
            return servicesLib.generateServiceError(IErrorEnum.UnknownError, 'Something went wrong while trying to get projects, please try again');
        }
    }

    async DeleteProject(id: string): ServiceResponse<string> {
        if (!id || !mongoose.isValidObjectId(id)) {
            return servicesLib.generateServiceError(IErrorEnum.DeleteProjectInvalidID, ' Invalid ID entered');
        }

        const deleteProjectDetails = await Project.findByIdAndUpdate(id, {
            $set: {
                isDeleted: true,
            },
        });

        if (!deleteProjectDetails) {
            return servicesLib.generateServiceError(IErrorEnum.DeleteProjectProjectFailedToDelete, ' Failed to delete project');
        }

        return {
            status: ServiceResponseStatus.Success,
            data: 'OK',
        };
    }
}
