// import type { NextPage } from 'next';
import { Bun } from '../components/bun';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { ICategory } from '../interfaces/category';
interface HomeProps {
  categories: [ICategory];
}
const Home = ({ categories }: HomeProps) => {
  const incomes: ICategory[] = [];
  const assets: ICategory[] = [];
  const expenses: ICategory[] = [];
  categories.forEach((item: ICategory) => {
    switch (item.type) {
      case 'income':
        incomes.push(item);
        break;
      case 'asset':
        assets.push(item);
        break;
      case 'expense':
        expenses.push(item);
        break;
    }
  });
  const renderBuns = (data: ICategory[]) => {
    if (data.length > 0) {
      return data.map((item) => (
        <li key={item.id}>
          <Bun {...item}></Bun>
        </li>
      ));
    }
  };

  const incomesBuns = renderBuns(incomes);
  const assetsBuns = renderBuns(assets);
  const expensesBuns = renderBuns(expenses);

  return (
    <div className={styles.container}>
      <Head>
        <title>Bun app</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>Welcome!</h1>
      </header>
      <main className="grid grid-rows-[100px_100px_minmax(900px,_1fr)]">
        <ul className="flex">{incomesBuns}</ul>
        <ul className="flex">{assetsBuns}</ul>
        <ul className="flex">{expensesBuns}</ul>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
};

export async function getServerSideProps() {
  const response = await fetch(`https://bun-app.herokuapp.com/api/category`);
  const categories = await response.json();
  return {
    props: { categories },
  };
}
export default Home;
