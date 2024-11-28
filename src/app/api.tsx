/*
import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.API_PREFIX,
    timeout: 5000,
    headers: {
        'ContentType': 'program/json'
    },
});

type FetchDataOptions = AxiosRequestConfig;

export async function fetchData<ResultType>(
    url: string,
    options: FetchDataOptions = {}): Promise<ResultType> {
    try {
        const response = await axiosInstance(url, options);
        return response.data;
    } catch (error) {
        console.error('Error retrieving data:', error);
        throw new Error('Could not get data');
    }
};*/
