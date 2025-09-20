import UserMapping from '../models/userMapping.model';
import User from '../models/user.model';
import Role from '../models/role.model';
// import Department from '../models/department.model';
import { Op } from 'sequelize';

class UserRepository {
  response: any;

  constructor() {
    this.response = {
      status_code: 200,
      message: null,
      error: null,
      data: null
    };
  }

  async getUsersByClientId(client_id: string, limit: number, offset: number, searchKey: string) {
    try {
      const searchFilter = searchKey
        ? {
            [Op.or]: [
              { '$user.first_name$': { [Op.iLike]: `%${searchKey}%` } },
              { '$user.last_name$': { [Op.iLike]: `%${searchKey}%` } },
              { '$user.email$': { [Op.iLike]: `%${searchKey}%` } },
              { '$user.phone$': { [Op.iLike]: `%${searchKey}%` } },
              { employee_id: { [Op.iLike]: `%${searchKey}%` } },
            ],
          }
        : {};

      const { count: totalCount, rows: userMappings } = await UserMapping.findAndCountAll({
        where: {
          client_id,
          ...searchFilter,
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'title', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'status'],
          },
          {
            model: Role,
            as: 'role',
            attributes: ['id', 'name', 'description', 'is_default'],
          },
       
        ],
        attributes: ['id', 'client_id', 'employee_id', 'position', 'joining_date', 'last_active_at', 'status'],
        order: [['created_at', 'DESC']],
        limit,
        offset,
        distinct: true,
      });

      this.response.data = {
        users: userMappings,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      };
      return this.response;
    } catch (error: any) {
      console.error('Error in getUsersByClientId query:', error);
      this.response.status_code = 500;
      this.response.message = 'Failed to fetch users';
      this.response.error = error.message || error;
      return this.response;
    }
  }
}

export default  UserRepository;
