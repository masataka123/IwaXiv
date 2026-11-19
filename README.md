# IwaXiv

論文、ノート・サーベイ、漫画、予想・問題・パズル、その他の資料を公開日順に並べる、日英両対応の個人アーカイブです。

## 手元で確認する

[Ruby](https://www.ruby-lang.org/ja/downloads/) 3.3.11 と Bundler を用意し、リポジトリのルートで実行します。

```sh
bundle install
bundle exec jekyll serve --livereload
```

[Jekyllのローカルプレビュー](http://localhost:4000/)を開きます。英語版は [/en/](http://localhost:4000/en/) にあります。

## 作品を追加する

[`_data/works.yml`](_data/works.yml) に1件追加します。公開日と固定番号、種類、題材を1回定義し、題名・著者・概要・本文を `ja` と `en` に記入します。`authors` は省略できます。`comments` を指定すると一覧と個別ページの備考欄に表示され、省略すると一覧の備考欄に概要が表示されます。本文はMarkdownです。種類と題材のキーは [`_data/taxonomy.yml`](_data/taxonomy.yml) に定義されています。

```yaml
- id: "2611.0004"
  published_on: "2026-11-19"
  type: notes
  topics: [AG, DG]
  ja:
    authors: 著者名
    title: 日本語のタイトル
    summary: 一覧に表示する概要
    body: |
      ## 本文
      ここに本文を書きます。
  en:
    authors: Author name
    title: English title
    summary: A short summary for the archive.
    body: |
      ## Text
      Write the English text here.
```

固定番号の形式は `YYMM.NNNN` です。初回公開の年月に、その月の連番4桁を付けます。公開後は `id` と `published_on` を維持すると、個別ページのURLと掲載順が安定します。Jekyllが `/abs/2611.0004/` と `/en/abs/2611.0004/` を生成します。

分野は `AG`（代数幾何学）、`CV`（多変数複素解析）、`DG`（微分幾何学）、`others`（その他）から指定します。絞り込みの指定はURLに残ります。たとえば `?type=notes&topic=DG` は微分幾何学のノート・サーベイに絞り込みます。

ゲーム・ぬいぐるみ・神社の資料は、作品の種類に `type: other` を指定します。

## PDF・漫画画像を掲載する

`assets/works/固定番号/` にファイルを置き、`_data/works.yml` の該当する項目にパスを書きます。GitHubのブラウザ画面からファイルを追加するときは、リポジトリの **Add file → Upload files** を使います。 [GitHub Docs](https://docs.github.com/ja/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)

- **PDF** は `pdf` に指定します。一覧に `[abs, pdf]`、個別ページに `PDF` リンクが出ます。漫画をPDFで配布する場合も同じ指定です。
- **画像** は `images` に閲覧順で並べます。PNG、JPEG、WebPなどを個別ページに縦に表示します。`alt` には各画像の内容を日英で記入できます。

次の例の `pdf` と `images` は作品項目の `type` や `topics` と同じ階層に追加します。どちらも任意です。

```yaml
  pdf: /assets/works/2611.0004/book.pdf
  images:
    - src: /assets/works/2611.0004/01.webp
      alt:
        ja: アリが紙の帯を歩きはじめる。
        en: An ant starts walking along a strip of paper.
    - src: /assets/works/2611.0004/02.webp
      alt:
        ja: アリが帯のひねりを通り過ぎる。
        en: The ant walks past the twist in the strip.
```

共通のファイルを日英両版で使えます。言語ごとに異なるPDFや画像を掲載する場合は、`ja` または `en` の中にも `pdf` や `images` を指定します。ファイルだけを掲載する作品では `body` を省略できます。

## GitHub Pagesで公開する

リポジトリの **Settings → Pages → Build and deployment → Source** で **GitHub Actions** を選びます。デフォルトブランチへのpush、またはActionsタブからの手動実行で、[`pages.yml`](.github/workflows/pages.yml) がJekyllをビルドして公開します。GitHub Pagesが返すベースパスをビルドに渡すため、リポジトリ名を含むプロジェクトサイトURLにも対応します。

一覧の構成と番号の形式は [LiuXiv](https://jihaoliu.org/liuxiv.html) を参考にしています。
