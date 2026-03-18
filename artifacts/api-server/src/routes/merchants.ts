import { Router, type IRouter } from "express";

const router: IRouter = Router();

const MERCHANTS = [
  {
    id: "m1",
    name: "C1 Espresso",
    description: "Iconic Christchurch café known for accepting Bitcoin since 2014. Great coffee and innovative menu.",
    category: "Café & Restaurant",
    address: "185 High Street, Christchurch Central",
    website: "https://www.c1espresso.co.nz/",
  },
  {
    id: "m2",
    name: "Bitcoin Dealers NZ",
    description: "Buy and sell Bitcoin locally with personalised service. In-person and online options for New Zealanders.",
    category: "Exchange",
    website: "https://www.bitcoindealers.co.nz/",
  },
  {
    id: "m3",
    name: "Easy Crypto",
    description: "New Zealand's most popular crypto on-ramp. Buy Bitcoin with NZD bank transfer quickly and easily.",
    category: "Exchange",
    website: "https://easycrypto.com/nz",
  },
  {
    id: "m4",
    name: "Codeblack Espresso",
    description: "Specialty coffee roasters in Christchurch accepting Bitcoin payments for online orders.",
    category: "Café & Coffee",
    address: "Christchurch",
  },
  {
    id: "m5",
    name: "Living Economies",
    description: "Community organisation promoting alternative currencies and local economic resilience in Canterbury.",
    category: "Community",
    address: "Christchurch",
  },
  {
    id: "m6",
    name: "Tech Trader NZ",
    description: "Pre-owned tech and electronics retailer. Accepts Bitcoin for computer parts and refurbished devices.",
    category: "Technology",
    address: "Christchurch",
  },
];

router.get("/merchants", (_req, res) => {
  res.json(MERCHANTS);
});

export default router;
