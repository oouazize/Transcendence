import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Query, Res } from '@nestjs/common';
import { channelDto } from './dto/channelDto';
import { ChannelService } from './channel.service';
import { Response } from 'express';
import { channelAdminDto, channelOwnerDto } from './dto/channelOwnerAdminDto';
import { UserOperationDto } from './dto/operateUserDto';

@Controller('channel')
export class ChannelController {
    constructor(private readonly channelservice: ChannelService) {}
    @Post('update')
    async updateOrCreateChannel(@Body() channelData: channelDto, @Res() res: Response)
    {
        await this.channelservice.channelUpdate(channelData);
        return res.status(HttpStatus.CREATED).send('channel was created');
    }
    @Post('setowner')
    async newChannelOwner(@Body() channelOwnerData: channelOwnerDto, @Res() res: Response)
    {
        this.channelservice.setChannelOwner(channelOwnerData);
        return res.status(HttpStatus.CREATED).send('new channel owner was set');
    }
    @Post('setadmin')
    async newChannelAdmin(@Body() channelAdminData: channelAdminDto, @Res() res: Response)
    {
        this.channelservice.setChannelAdmin(channelAdminData);
        return res.status(HttpStatus.CREATED).send('new channel admin was set');
    }
    @Post('promoteuser')
    async promoteUserFromChannel(@Body() promoteUser: UserOperationDto, @Res() res: Response)
    {
        await this.channelservice.promoteUserToAdmin(promoteUser);
        return res.status(HttpStatus.CREATED).send('user was promoted successfully');
    }

    @Get('userGrade/:id')
    async getUserGrade(@Param('id', ParseIntPipe) userId: number, @Query('channelId') channelId: number)
    {
        return await this.channelservice.getUserGrade(userId, channelId);
    }

    @Get('channelData/:id')
    async getChannelUsers(@Param('id', ParseIntPipe) id: number)
    {
        return await this.channelservice.getChannelData(id);
    }
}
