import { promisify } from "util";
import jwt from "jsonwebtoken";

import * as userConsts from '../consts/user.consts';
import config from "../config";

const jwtVerifyPromise = promisify(jwt.verify);

export function tokenAccess(resolvers) {
  Object.keys(resolvers).forEach(key => {
    resolvers[key] = resolvers[key].wrapResolve(next => rp => {
      // rp = resolveParams = { source, args, context, info }
      const { context } = rp;

      // check header or url parameters or post parameters for token
      const token = context.body.token || context.query.token || context.headers['x-access-token'];

      // decode token
      if (token) {
        // verifies secret and checks exp
        return jwtVerifyPromise(token, config.app.at_string).then((decoded) => {
            context.decoded = decoded; // add the decoded data to context for further use
            return next(rp);
        });
      } else {
        // if there is no token - throw an error
        throw new Error(userConsts.MISSING_TOKEN_MSG);
      }
    });
  });
  return resolvers;
}
