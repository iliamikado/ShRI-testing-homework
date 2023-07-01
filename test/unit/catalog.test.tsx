import React from 'react';
import type { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import { Catalog } from '../../src/client/pages/Catalog';
import { Product } from '../../src/client/pages/Product';
import { Provider } from 'react-redux';
import { initStore } from '../../src/client/store';
import { describe, it, expect } from '@jest/globals';
import { getProductById, getProducts } from './testProducts';
import { BrowserRouter, Route, MemoryRouter } from 'react-router-dom';
import { MockedExampleApi, CartApi } from './mockedApi';

const basename = '/';
const api = new MockedExampleApi(basename) as any;
const cart = new CartApi();
const store = initStore(api, cart);

const Wrapper = (props: {children: ReactNode}) => {
    return (
        <BrowserRouter basename={basename}>
            <Provider store={store}>
                {props.children}
            </Provider>
        </BrowserRouter>
    )
}

describe('Catalog', () => {

    it('Should show all products from the server', async () => {
        const products = getProducts();
        const { getByTestId } = render(<Catalog/>, {wrapper: Wrapper});
        await new Promise(process.nextTick);
        const items = products.map(product => (getByTestId(`product-item-${product.id}`)));
        const finalProducts = items.map(item => {
            return {
                name: item.querySelector('h5')?.innerHTML,
                price: item.querySelector('p')?.innerHTML,
                link: item.querySelector('a')?.getAttribute('href')
            }
        })
        expect(finalProducts).toEqual(products.map(product => ({
            name: product.name,
            price: '$' + product.price,
            link: '/catalog/' + product.id
        })));
        // screen.logTestingPlaygroundURL()
    });

    it('should show all information on product page', async () => {
        const id = 0;
        const product = getProductById(id);
        const { getByTestId } = render(
            <MemoryRouter initialEntries={[`/catalog/${id}`]}>
                <Route path={'/catalog/:id'}>
                    <Product/>
                </Route>
            </MemoryRouter>,
        {wrapper: Wrapper});
        await new Promise(process.nextTick);
        const finalProduct = {
            id: id,
            name: getByTestId('name').innerHTML,
            description: getByTestId('description').innerHTML,
            price: getByTestId('price').innerHTML,
            color: getByTestId('color').innerHTML,
            material: getByTestId('material').innerHTML
        }
        expect(finalProduct).toEqual({...product, price: '$' + product?.price});
        screen.logTestingPlaygroundURL()
    })
});
