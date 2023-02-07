import { Body, Controller, Post } from '@nestjs/common';

import { CreateRegisterDto } from './dto/create-register.dto';
import { RegisterService } from './register.service';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  create(@Body() createRegisterDto: CreateRegisterDto) {
    console.log('createRegisterDto', createRegisterDto);
    return this.registerService.create(createRegisterDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.registerService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateRegisterDto: UpdateRegisterDto,
  // ) {
  //   return this.registerService.update(+id, updateRegisterDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.registerService.remove(+id);
  // }
}
