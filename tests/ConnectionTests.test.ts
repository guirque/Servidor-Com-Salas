import { describe, expect, it, test } from '@jest/globals';
import dotenv from 'dotenv';
import supertest from 'supertest';

dotenv.config();

const host = `${process.env.DOMAIN_URL}:${process.env.PORT}`;
let availableRooms: Array<any> = [];

test('Creating a Room', async () => {
    //Creating Room with normal requirements
    let response = await supertest(host).post('/createRoom').send({ name: 'Test Room', max: 3 });
    expect(response.error).toBeFalsy();


    //Creating Room with inappropriate data
    response = await supertest(host).post('/createRoom').send({ name: '', max: 10 });
    expect(response.statusCode).toBe(400);
})

test('Getting Rooms', async () => {
    let response = await supertest(host).get('/rooms');
    expect(response.error).toBeFalsy();

    //If not empty
    if (response.body != null) {
        let jsonResponse = JSON.parse(response.body);
        availableRooms = jsonResponse;

        jsonResponse.forEach((room: Object) => {
            ['number', 'name', 'numOfUsers', 'maxUsers'].forEach((property) => {
                expect(room).toHaveProperty(property);
            })
        })
    }
});

test('Entering Rooms', async () => {
    //Trying to enter rooms
    console.log(availableRooms);
    availableRooms.forEach(
        async (room) => {
            let response = await supertest(host).get(`/rooms/${room.number}`);
            if (room.numOfUsers == room.maxUsers) expect(response.statusCode).not.toBe(200) //if room is occupied
            else expect(response.statusCode).toBe(200);
        })
})