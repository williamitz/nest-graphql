import { BadRequestException, NotFoundException, InternalServerErrorException, UnauthorizedException, Logger } from "@nestjs/common";
import { QueryFailedError } from "typeorm";

const logger = new Logger();

export const handlerError = ( error: any, errorMessage?: string ): never =>  {

    logger.error( error );
    
    // console.log('handleError error ::: ', error);
    
    let { driverError, message } = error as QueryFailedError;
    
    console.log('driverError error ::: ', message);

    if( driverError?.code === '23505' )
        throw new BadRequestException( driverError?.detail.replace('key', '') || errorMessage );

    if( error instanceof NotFoundException  )
        throw new NotFoundException( message || errorMessage || `Not found Error` );

    if( error instanceof UnauthorizedException  )
        throw new UnauthorizedException( message || errorMessage || `Unauthorized Error` );
    

    throw new InternalServerErrorException( message || errorMessage || 'Internal Server Error' );

}