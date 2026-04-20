"use strict";
// get filed by Id or all
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldById = exports.getFields = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
// get all fields
exports.getFields = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({
            message: 'Not authorized'
        });
        return;
    }
    // 1. check if the user is an agent, if yes return only his fields
    const isAgent = req.user.role.name === 'Agent';
    // admin can see all fields, agent can see only his fields
    const isAdmin = req.user.role.name === 'Admin';
    if (!isAdmin && !isAgent) {
        res.status(403).json({
            message: 'Access denied'
        });
        return;
    }
    // 2. get the fields from the database
    if (isAdmin) {
        const fields = yield prisma_1.default.field.findMany({
            include: {
                agent: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                updates: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        agent: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
        return res.status(200).json({
            message: 'Fields retrieved successfully',
            fields
        });
    }
    if (isAgent) {
        const fields = yield prisma_1.default.field.findMany({
            where: { agentId: req.user.id },
            include: {
                agent: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                updates: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        agent: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
        return res.status(200).json({
            message: 'Fields retrieved successfully',
            fields
        });
    }
    return res.status(403).json({
        message: 'Access denied'
    });
}));
// get field by id
exports.getFieldById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. get the field id from the request params
    const { id } = req.params;
    if (!req.user) {
        res.status(401).json({
            message: 'Not authorized'
        });
        return;
    }
    const isAdmin = req.user.role.name === 'Admin';
    const isAgent = req.user.role.name === 'Agent';
    if (!isAdmin && !isAgent) {
        res.status(403).json({
            message: 'Access denied'
        });
        return;
    }
    // 2. Validate the field id
    if (!id) {
        res.status(400).json({
            message: 'Please provide the field id'
        });
        return;
    }
    // 2. get the field from the database
    if (isAdmin) {
        const field = yield prisma_1.default.field.findUnique({
            where: { id },
            include: {
                agent: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                updates: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        agent: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
        if (!field) {
            res.status(404).json({
                message: 'Field not found'
            });
            return;
        }
        return res.status(200).json({
            message: 'Field retrieved successfully',
            field
        });
    }
    if (isAgent) {
        const field = yield prisma_1.default.field.findFirst({
            where: { id, agentId: req.user.id },
            include: {
                agent: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                updates: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        agent: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
        if (!field) {
            res.status(404).json({
                message: 'Field not found'
            });
            return;
        }
        return res.status(200).json({
            message: 'Field retrieved successfully',
            field
        });
    }
    return res.status(403).json({
        message: 'Access denied'
    });
}));
