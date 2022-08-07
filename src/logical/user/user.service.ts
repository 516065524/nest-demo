import { Injectable } from '@nestjs/common';
import * as Sequelize from 'Sequelize';
import sequelize from 'src/database/sequelize';
import { encryptPassword, makeSalt } from 'src/utils/cryptogram';

@Injectable()
export class UserService {
  async findOne(username: string): Promise<any | undefined> {
    const sql = `
      SELECT
        user_id userId, account_name username, real_name realName, passwd password, passwd_salt salt, mobile, role
      FROM
        admin_user
      WHERE
        account_name = '${username}'
    `;
    try {
      const user = (
        await sequelize.query(sql, {
          type: Sequelize.QueryTypes.SELECT, // 查询方法
          raw: true, // 是否使用数组组装的方式展示结果
          logging: true, // 是否将SQL语句打印到控制台
        })
      )[0];
      return user;
    } catch (error) {
      console.error(error);
      return void 0;
    }
    // try {
    //   const res = await sequelize.query(sql, {
    //     type: Sequelize.QueryTypes.SELECT,
    //     raw: true,
    //     logging: true,
    //   });
    //   const user = res[0];
    //   if (user) {
    //     return {
    //       code: 200,
    //       data: {
    //         user,
    //       },
    //       msg: 'Success',
    //     };
    //   } else {
    //     return {
    //       code: 600,
    //       msg: '查无此人',
    //     };
    //   }
    // } catch (error) {
    //   return {
    //     code: 503,
    //     msg: `Service error: ${error}`,
    //   };
    // }
  }
  async register(requestBody: any): Promise<any> {
    const { accountName, realName, password, repassword, mobile } = requestBody;
    if (password !== repassword) {
      return {
        code: 400,
        msg: '两次密码输入不一致',
      };
    }
    const user = await this.findOne(accountName);
    if (user) {
      return {
        code: 400,
        msg: '用户已存在',
      };
    }
    const salt = makeSalt();
    const hashPwd = encryptPassword(password, salt);
    const registerSQL = `
      INSERT INTO admin_user
        (account_name, real_name, passwd, passwd_salt, mobile, user_status, role, create_by)
      VALUES
        ('${accountName}','${realName}','${hashPwd}','${salt}','${mobile}',1,3,0)
    `;
    try {
      await sequelize.query(registerSQL, { logging: false });
      return {
        code: 200,
        msg: 'Success',
      };
    } catch (error) {
      return {
        code: 503,
        msg: `Service.error: ${error}`,
      };
    }
  }
}
