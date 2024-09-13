import sequelize from "../Models/index.js";
import initModels from "../Models/init-models.js";
import bcrypt from "bcrypt";
import {taoToken} from "../Config/jwtConfig.js";
import { Sequelize } from 'sequelize';
import jwt from "jsonwebtoken";

const Op = Sequelize.Op;
const model = initModels(sequelize);

const signUp = async (req, res) => {
    try {
        let { HOTEN_ND, EMAIL, MATKHAU, SDT_ND, NGAYSINH, GIOITINH, NGAYDANGKY, ANHDAIDIEN, VAITRO } = req.body;
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
        if (!passwordRegex.test(MATKHAU)) {
            res.status(400).send("Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất 1 chữ cái thường, 1 chữ cái hoa và 1 ký tự đặc biệt.");
            return;
        }

        let whereCondition = {};
        if (SDT) {
            whereCondition.SDT_ND = SDT_ND;
        }
        if (E) {
            whereCondition.EMAIL = EMAIL;
        }

        let checkTK = await model.NGUOIDUNG.findOne({
            where: whereCondition,
        });

        if (checkTK) {
            res.status(200).send("Email hoặc số điện thoại đã tồn tại!");
            return;
        }
        
        if (!SDT && !EMAIL) {
            res.status(400).send("Vui lòng cung cấp ít nhất một trong hai thông tin: Email hoặc Số điện thoại");
            return;
        }

        EMAIL = EMAIL || "0";
        SDT = SDT || "0";

        ANHDAIDIEN = ANHDAIDIEN || "noimg.png";
        VAITRO = VAITRO || "USER";
        NGAYDANGKY = NGAYDANGKY || new Date();

        let newData = {
            SDT_ND,
            EMAIL,
            MATKHAU: bcrypt.hashSync(MatKhau, 10),
            NGAYSINH,
            GIOITINH,
            HOTEN_ND,
            ANHDAIDIEN,
            VAITRO,
            NGAYDANGKY
        };
        
        await model.NGUOIDUNG.create(newData);
        res.status(200).send("Đăng ký tài khoản thành công!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Đã có lỗi trong quá trình xử lý");
    }
};

const login = async (req, res) => {
    try {
        let { Email, SDT, MatKhau } = req.body;

        if (!Email && !SDT) {
            res.status(400).send("Vui lòng cung cấp email hoặc số điện thoại");
            return;
        }

        let checkTK = await model.NguoiDung.findOne({
            where: {
                [Op.or]: [
                    Email ? { Email } : {}, 
                    SDT ? { SDT } : {}
                ]
            },
        });

        if (checkTK) {
            let checkPass = bcrypt.compareSync(MatKhau, checkTK.MatKhau);
            if (checkPass) {
                let token = taoToken(checkTK);
                res.status(200).send(token);
            } else {
                res.status(400).send("Mật khẩu không đúng");
            }
        } else {
            res.status(400).send("Tài khoản không đúng");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Đã có lỗi trong quá trình xử lý");
    }
};

export {signUp, login}