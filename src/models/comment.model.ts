import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/instance';
import TenantModel from './tenant.model';
import OpinionModel from './opinion.model';
import UserModel from './user.model';
import TopicModel from './topic.model';

class CommentModel extends Model {
    public id!: string;
    public tenant_id!: string;
    public topic_id!: string;
    public opinion_id!: string;
    public description!: string;
    public user_id!: string;
    public created_on!: number;
    public updated_on!: number;
    public created_by!: string;
    public updated_by!: string;
}

CommentModel.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        tenant_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: TenantModel,
                key: "id",
            },
        },
        topic_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: TopicModel,
                key: "id",
            },
        },
        opinion_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: OpinionModel,
                key: "id",
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: UserModel,
                key: "id",
            },
        },
        created_on: {
            type: DataTypes.BIGINT.UNSIGNED,
            defaultValue: Date.now,
        },
        updated_on: {
            type: DataTypes.BIGINT.UNSIGNED,
            defaultValue: Date.now,
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: true
        },
        updated_by: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize,
        tableName: 'comments',
        timestamps: false,
    }
);

export default CommentModel;
