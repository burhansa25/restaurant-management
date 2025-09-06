import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemas/auth.schema";

const authApiRequests = {
  sLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body), //server
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
  //client
};

export default authApiRequests;
