import { test, expect, it, describe } from '@jest/globals';
import supertest from 'supertest';
import dotenv from 'dotenv';
dotenv.config();

const host = `${process.env.DOMAIN_URL}:${process.env.PORT}`;