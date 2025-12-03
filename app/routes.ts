import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

const routes: RouteConfig = [

  route("/auth", "routes/index.tsx"), // auth
  layout("routes/AppLayout.tsx", [
    index("routes/inbox.tsx"),       // inbox
    route("/sent", "routes/sent.tsx"), // /sent
    route("/mail/:id", "routes/mailbody.tsx"), // /mailbox
  ]),
];

export default routes;