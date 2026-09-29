# LaTeX CV

Build the one-page academic CV with a typical TeX Live or MiKTeX installation:

```bash
cd cv-latex
latexmk -pdf -interaction=nonstopmode -halt-on-error cv.tex
cp cv.pdf ../assets/pdf/Lizhong_Hu_CV.pdf

# Build Chinese version (XeLaTeX and SimSun/SimHei/FangSong/KaiTi fonts required):
latexmk -xelatex -interaction=nonstopmode -halt-on-error cv-zh.tex
cp cv-zh.pdf ../assets/pdf/Lizhong_Hu_CV_zh.pdf
cp cv-zh.pdf ../assets/pdf/胡力中_简历.pdf
```

To remove local auxiliary files after copying the PDF:

```bash
latexmk -C cv.tex
latexmk -C cv-zh.tex
```

The copied PDFs are published by Jekyll at `/assets/pdf/Lizhong_Hu_CV.pdf` and `/assets/pdf/Lizhong_Hu_CV_zh.pdf`.

Official names and source links are recorded in [name-sources.md](name-sources.md). Keep this record updated when changing institution or competition names.
