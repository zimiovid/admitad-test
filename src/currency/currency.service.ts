import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, getMongoRepository } from "typeorm"

import { Currency } from "./currency.entity"
import { CurrencyDto } from "./dto/index.dto"

@Injectable()
export class CurrencyService {
    constructor(
        @InjectRepository(Currency)
        private readonly currencyRepository: Repository<Currency>
    ) { }

    async getList(count = 10, offset = 0): Promise<Array<Currency>> {
        return await this.currencyRepository.find({
            take: count,
            skip: offset * count
        })
    }

    async getOne(id: string) {
        return await this.currencyRepository.findOne({ id })
    }

    async create(currency: CurrencyDto): Promise<Currency> {
        const c = new Currency()
        c.id = currency.id
        c.name = currency.name
        c.nominal = currency.nominal
        c.numcode = currency.numcode
        c.value = currency.value
        return await this.currencyRepository.save(c)
    }

    async removeAll(): Promise<any> {
        const cRepository = getMongoRepository(Currency)
        await cRepository.deleteMany({})
    }
}
