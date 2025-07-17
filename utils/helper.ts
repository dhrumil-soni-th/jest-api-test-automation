import adminController from "../controller/admin.controller";
import controller from "../controller/categories.controller";

export const login = async (email: string, password: string) => {
  const response = await adminController.postAdminLogin({
    email: email,
    password: password,
  });
  return response.body.token;
};

export const getCategoryId = async (token: string) => {
  const body = {
    name: "API Automation Category " + Math.floor(Math.random() * 100000),
  };
  const response = await controller
    .postCategories(body)
    .set("Authorization", `Bearer ${token}`);
  return response.body._id;
};
