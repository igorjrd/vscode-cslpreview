// citeproc.d.ts

declare module 'citeproc' {
  export interface CiteProcSys {
    retrieveLocale(lang: string): string;
    retrieveItem(itemId: string): Object;
  }

  export class CitationItem {
    id: string;
    item?: Object;
  }

  export class CitationCluster {
    citationItems: Array<CitationItem>;
    properties?: Object;
  }

  export class BibliographyMetadata {
    entryspacing?: any;
    linespacing?: number;
    maxoffset?: number;
    'second-field-align': Boolean;
    hangingindent?: Boolean;
    bibstart?: string;
    bibend?: string;
  }

  export interface CslEngine {
    updateItems(citableItemIds: Array<String>): void;
    appendCitationCluster(citationCluster: CitationCluster): Array<[index: number, citation: string, id: string]>;
    processCitationCluster(citationCluster: CitationCluster, citationsPre: Array<string | number>, citationsPost: Array<string | number>): [metadata: Object, citations: Array<[index: Number, citation: String, id: String]>];
    makeBibliography(): [metadata: BibliographyMetadata, htmlEntries: Array<string>];
  }

  // export abstract class Engine implements Engine {
  //     constructor(sys: CiteProcSys, styleCslSource: String, lang: string, forcedLang: string)
  // }

  export const Engine: new (
    sys: CiteProcSys, styleCslSource: String, lang: string, forcedLang: string
  ) => CslEngine;

  // export class CSL {
  //     static Engine: new (sys: CiteProcSys, styleCslSource: String, lang: string, forcedLang: string) => CslEngine;
  // }

  // // Definindo a interface CSL para o processador de citações
  // export interface CSL {
  //   // Formatar citação no estilo definido
  //   formatCitation(citation: CSLCitation): string;

  //   // Formatar a bibliografia de uma lista de citações
  //   formatBibliography(citations: CSLItem[]): string;

  //   // Definir o estilo de citação
  //   setStylesheet(stylesheet: string): void;

  //   // Definir a localidade da citação
  //   setLocale(locale: string): void;

  //   // Definir o estilo de citação (ex: "apa", "chicago")
  //   setCitationStyle(style: string): void;

  //   // Adicionar um item de citação ao processador
  //   addItem(item: CSLItem): void;

  //   // Processar todas as citações e gerar as referências bibliográficas
  //   processItems(): void;
  // }

  // // Representação de um item de citação
  // export interface CSLItem {
  //   id: string;
  //   type: string;  // Tipo de citação (ex: "book", "article-journal")
  //   title: string;
  //   author: Array<CSLAuthor>;
  //   year: string;
  //   [key: string]: any;
  // }

  // // Representação do autor de uma citação
  // export interface CSLAuthor {
  //   family: string;
  //   given: string;
  //   [key: string]: any;
  // }

  // // Representação de uma citação específica
  // export interface CSLCitation {
  //   id: string;
  //   item: CSLItem;
  //   [key: string]: any;
  // }

  // // Opções para configurar o processador de citações
  // export interface CitationOptions {
  //   locale: string;
  //   style: string;
  //   bibliography: boolean;
  //   [key: string]: any;
  // }

  // // Função para criar um processador CSL com opções
  // export function createCSLProcessor(options: CitationOptions): CSL;

  // // Função para carregar e aplicar um estilo de citação
  // export function loadCitationStyle(style: string): void;

  // // Função para gerar a bibliografia a partir de uma lista de itens CSL
  // export function generateBibliography(citations: CSLItem[], options: CitationOptions): string;

  // // Função para criar e adicionar itens de citação a partir de um item CSL
  // export function addCitationItems(items: CSLItem[]): void;
}
