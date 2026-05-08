import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paper, Typography } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const quotes = {
  customer: [
    "First we eat, then we do everything else. — M.F.K. Fisher",
    "People who love to eat are always the best people. — Julia Child",
    "Cooking is like love. It should be entered into with abandon or not at all. — Harriet Van Horne",
    "Food is symbolic of love when words are inadequate. — Alan D. Wolfelt"
  ],
  chef: [
    "A recipe has no soul. You as the cook must bring soul to the recipe. — Thomas Keller",
    "The secret of success in life is to eat what you like. — Mark Twain",
    "Cooking requires confident guesswork and improvisation. — Paul Theroux"
  ],
  waiter: [
    "Service is the rent we pay for being. — Marian Wright Edelman",
    "We see our customers as invited guests to a party. — Jeff Bezos",
    "A smile is the universal welcome."
  ],
  manager: [
    "Quality is not an act, it is a habit. — Aristotle",
    "To manage a restaurant is to manage people, expectations, and flavors.",
    "The details are not the details. They make the design. — Charles Eames"
  ],
  auth: [
    "Step into a world where flavor meets passion.",
    "Your table is waiting.",
    "Indulge in culinary perfection."
  ]
};

function QuoteBanner({ category = "customer" }) {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const categoryQuotes = quotes[category] || quotes.customer;
    setQuote(categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)]);
  }, [category]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={quote}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <Paper
          elevation={0}
          sx={{
            py: 2,
            px: 3,
            mx: "auto",
            my: 3,
            maxWidth: 800,
            textAlign: "center",
            background: "linear-gradient(90deg, transparent, rgba(225, 29, 72, 0.06), transparent)",
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "divider",
            backdropFilter: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <FormatQuoteIcon sx={{ color: "secondary.main", fontSize: 28, opacity: 0.6, transform: "scaleX(-1)" }} />
          <Typography
            variant="body1"
            sx={{
              fontStyle: "italic",
              color: "secondary.main",
              fontSize: "1.1rem",
              fontWeight: 300,
            }}
          >
            {quote}
          </Typography>
          <FormatQuoteIcon sx={{ color: "secondary.main", fontSize: 28, opacity: 0.6 }} />
        </Paper>
      </motion.div>
    </AnimatePresence>
  );
}

export default QuoteBanner;
