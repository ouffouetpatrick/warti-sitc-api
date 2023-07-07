import { createParamDecorator } from '@nestjs/common';
export const CurrentUser = createParamDecorator((_, request) => {
    const user = request.args[0].user;
    return user;
})

// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';

// export const CurrentUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     const user = request.user;

//     if (!user) {
//       const token = request.headers.authorization?.split(' ')[1];

//       if (token) {
//         const jwtService = new JwtService(token); // Créez une instance du service JwtService
//         const decodedToken = jwtService.verify(token);
//         const currentUser = decodedToken.user;
//         return currentUser;
        
//       } 
//       console.log(token,"token");
//     //   console.log(currentUser,"token")
//     }

//     return user;
//   },
// );

