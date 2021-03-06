import {
    Controller,
    Get,
    Param,
    Query,
    UseGuards,
    HttpException,
    HttpStatus
} from "@nestjs/common"
import {
    ApiOperation,
    ApiBearerAuth,
    ApiQuery,
    ApiTags,
    ApiHeader,
    ApiOkResponse,
    ApiUnauthorizedResponse
} from "@nestjs/swagger"

import { CurrencyService } from "./currency.service"
import { JwtAuthGuard } from "../auth/jwt-auth.guard"
import { serverResponse } from "../constants/responses"

@ApiHeader({
    name: "Authorization",
    description: "Authorization Bearer token",
    required: true
})
@ApiTags("currency")
@ApiBearerAuth()
@Controller()
export class CurrencyController {
    constructor(private currencyService: CurrencyService) { }

    @ApiQuery({
        name: "offset",
        required: false,
        description: "currencies to skip",
        type: Number
    })
    @ApiQuery({
        name: "limit",
        required: false,
        description: "currencies to take",
        type: Number
    })
    @ApiOperation({ summary: "Get currencies" })
    @ApiOkResponse()
    @ApiUnauthorizedResponse()
    @UseGuards(JwtAuthGuard)
    @Get("/currencies")
    async getCurrencyList(
        @Query() query: { offset: number | string; limit: number | string }
    ) {
        const { offset, limit } = query
        return await this.currencyService.getList(Number(limit), Number(offset))
    }

    @ApiOperation({ summary: "Get single currency" })
    @ApiOkResponse()
    @ApiUnauthorizedResponse({ description: "Unathorized" })
    @UseGuards(JwtAuthGuard)
    @Get("/currency/:id")
    async getCurrency(@Param() params: { id: string }) {
        if (!params || !params.id)
            throw new HttpException(
                serverResponse.PARAMS_REQUIRED,
                HttpStatus.BAD_REQUEST
            )
        return await this.currencyService.getOne(params.id)
    }
}
