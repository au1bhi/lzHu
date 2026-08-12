# LaTeX CV

Build the one-page academic CV with a typical TeX Live or MiKTeX installation:

```bash
cd cv-latex
latexmk -pdf -interaction=nonstopmode -halt-on-error cv.tex
cp cv.pdf ../assets/pdf/Lizhong_Hu_CV.pdf
```

To remove local auxiliary files after copying the PDF:

```bash
latexmk -C cv.tex
```

The copied PDF is published by Jekyll at `/assets/pdf/Lizhong_Hu_CV.pdf`.
