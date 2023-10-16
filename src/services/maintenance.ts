import mongoose, { LeanDocument } from 'mongoose';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Maintenance from 'models/Maintenance';
import servicesLib from '~lib/error';
import { IErrorEnum } from '~entities/Error';
import { ServiceResponse, ServiceResponseStatus } from './types';
import config from '~config';
import { GetMaintenanceResponse, IServerMaintenance } from '~entities/Maintenance';

dayjs.extend(utc);

export default class MaintenanceService {
    async CreateMaintenance(standardArr: [string], customerName: string, invoiceDateNum: number, auditDateNum: number, mrmDateNum: number, docDateNum: number, proposalName: string, quotationName: string, date: Date, remarks: string): ServiceResponse<string> {
        try {
            const filePath = config.fileUploadPath.replace('public/', '');
            const proposalUrl = `${filePath}${proposalName}`;
            const quotationUrl = `${filePath}${quotationName}`;
            let maintenanceDetails = {};

            const month: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

            if (
                month.includes(invoiceDateNum)
                && month.includes(auditDateNum)
                && month.includes(docDateNum)
                && month.includes(mrmDateNum)
            ) {
                if (proposalName === '' && quotationName) {
                    maintenanceDetails = {
                        standard: standardArr,
                        customerName,
                        invoice: invoiceDateNum,
                        audit: auditDateNum,
                        mrm: mrmDateNum,
                        doc: docDateNum,
                        quotationImageUrl: quotationUrl,
                        date,
                        remarks,
                    };
                } else if (quotationName === '' && proposalName) {
                    maintenanceDetails = {
                        standard: standardArr,
                        customerName,
                        invoice: invoiceDateNum,
                        audit: auditDateNum,
                        mrm: mrmDateNum,
                        doc: docDateNum,
                        proposalImageUrl: proposalUrl,
                        date,
                        remarks,
                    };
                } else if (quotationName === '' && proposalName === '') {
                    maintenanceDetails = {
                        standard: standardArr,
                        customerName,
                        invoice: invoiceDateNum,
                        audit: auditDateNum,
                        mrm: mrmDateNum,
                        doc: docDateNum,
                        date,
                        remarks,
                    };
                } else {
                    maintenanceDetails = {
                        standard: standardArr,
                        customerName,
                        invoice: invoiceDateNum,
                        audit: auditDateNum,
                        mrm: mrmDateNum,
                        doc: docDateNum,
                        proposalImageUrl: proposalUrl,
                        quotationImageUrl: quotationUrl,
                        date,
                        remarks,
                    };
                }
                await Maintenance.create(maintenanceDetails);

                return {
                    status: ServiceResponseStatus.Success,
                    data: 'OK',
                };
            }
            return servicesLib.generateServiceError(IErrorEnum.CreateMaintenanceInvalidMonth, ' Invalid Month');
        } catch (err) {
            return servicesLib.generateServiceError(IErrorEnum.UnknownError, ' Something went wrong while creating maintenance collection, please try again');
        }
    }

    async GetMaintenance(
        index: number,
        search: string | undefined,
        dateFilter: string | undefined,
        invoiceDateNum: number | undefined,
        auditDateNum: number | undefined,
        mrmDateNum: number | undefined,
        docDateNum: number | undefined,
    ): ServiceResponse<GetMaintenanceResponse> {
        try {
            const page = index || 1;
            const size = 10;
            const limit = size;
            const skip = (page - 1) * size;

            let incrementPerFilter = 0;
            if (search) {
                incrementPerFilter += 1;
            }
            if (dateFilter) {
                incrementPerFilter += 1;
            }
            if (invoiceDateNum) {
                incrementPerFilter += 1;
            }
            if (auditDateNum) {
                incrementPerFilter += 1;
            }
            if (mrmDateNum) {
                incrementPerFilter += 1;
            }
            if (docDateNum) {
                incrementPerFilter += 1;
            }

            if (incrementPerFilter > 1) {
                return servicesLib.generateServiceError(IErrorEnum.GetMaintenanceMoreThanOneFilter, 'Only one filter is allowed at a time');
            }

            const populateImageUrl = (url: string | undefined) => {
                if (url) return `https://${config.host}/${url}`;
                return url;
            };

            let searchParam = {};

            if (search) {
                searchParam = {
                    customerName: {
                        $regex: search, $options: 'i',
                    },
                };
            } else if (dateFilter) {
                const populatedDate = dayjs(`${dateFilter}-01`);
                if (!populatedDate.isValid()) {
                    return servicesLib.generateServiceError(IErrorEnum.GetMaintenanceInvalidDateFilter, 'Invalid datefilter selected.');
                }

                const fromDate = populatedDate.startOf('month').utc();
                const toDate = populatedDate.endOf('month').utc();

                searchParam = {
                    date: {
                        $gte: fromDate.toDate(),
                        $lt: toDate.toDate(),
                    },
                };
            } else if (invoiceDateNum) {
                searchParam = {
                    invoice: invoiceDateNum,
                };
            } else if (auditDateNum) {
                searchParam = {
                    audit: auditDateNum,
                };
            } else if (mrmDateNum) {
                searchParam = {
                    mrm: mrmDateNum,
                };
            } else if (docDateNum) {
                searchParam = {
                    doc: docDateNum,
                };
            }

            const maintenanceCollectionFromDb: LeanDocument<IServerMaintenance>[] = await Maintenance
                .find({
                    ...searchParam,
                    isDeleted: false,
                })
                .sort('-createdAt')
                .limit(limit)
                .skip(skip)
                .lean()
                .exec();

            const maxIndex = Math.ceil(await Maintenance.countDocuments({ searchParam, isDeleted: false }) / limit);

            const output = {
                index,
                maxIndex,
                data: maintenanceCollectionFromDb.map((item) => ({
                    id: item._id,
                    createdAt: item.createdAt,
                    standard: item.standard,
                    customerName: item.customerName,
                    invoice: item.invoice,
                    audit: item.audit,
                    mrm: item.mrm,
                    doc: item.doc,
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
            return servicesLib.generateServiceError(IErrorEnum.UnknownError, ' Something went wrong while getting maintenances , please try again');
        }
    }

    async EditMaintenance(id: string, standardArr: string[], customerName: string, invoiceDateNum: number, auditDateNum: number, mrmDateNum: number, docDateNum: number, proposalName: string, quotationName: string, date: string, remarks: string): ServiceResponse<string> {
        if (!mongoose.isValidObjectId(id)) {
            return servicesLib.generateServiceError(IErrorEnum.EditMaintenanceInvalidId, 'Invalid ID Found');
        }
        const month: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        if (
            !(month.includes(invoiceDateNum)
                && month.includes(auditDateNum)
                && month.includes(docDateNum)
                && month.includes(mrmDateNum))
        ) {
            return servicesLib.generateServiceError(IErrorEnum.EditMaintenanceInvalidMonth, 'Invalid Month');
        }

        try {
            const filePath = config.fileUploadPath.replace('public/', '');
            const proposalImageUrl = `${filePath}${proposalName}`;
            const quotationImageUrl = `${filePath}${quotationName}`;

            const updateMaintenanceDetails = await Maintenance.findByIdAndUpdate(id, {
                $set: {
                    standard: standardArr,
                    customerName,
                    invoice: invoiceDateNum,
                    audit: auditDateNum,
                    mrm: mrmDateNum,
                    doc: docDateNum,
                    proposalImageUrl,
                    quotationImageUrl,
                    date,
                    remarks,
                },
            });

            if (!updateMaintenanceDetails) {
                return servicesLib.generateServiceError(IErrorEnum.EditMaintenanceFailedToEditMaintenance, ' Failed to edit maintenance');
            }

            return {
                status: ServiceResponseStatus.Success,
                data: 'OK',
            };
        } catch (err) {
            console.log(err);
            return servicesLib.generateServiceError(IErrorEnum.UnknownError, ' Something went wrong while updating maintenances, please try again');
        }
    }

    async DeleteMaintenance(id: string): ServiceResponse<string> {
        if (!id || !mongoose.isValidObjectId(id)) {
            return servicesLib.generateServiceError(IErrorEnum.DeleteMaintenanceInvalidId, 'Invalid ID');
        }

        const deleteMaintenanceDetails = await Maintenance.findByIdAndUpdate(id, {
            $set: {
                isDeleted: true,
            },
        });

        if (!deleteMaintenanceDetails) {
            return servicesLib.generateServiceError(IErrorEnum.DeleteMaintenanceFailedToDeleteMaintenance, 'Failed to delete maintenance');
        }

        return {
            status: ServiceResponseStatus.Success,
            data: 'OK',
        };
    }
}
