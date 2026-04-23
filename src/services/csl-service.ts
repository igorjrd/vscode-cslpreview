import { l10n } from 'vscode';
import { BibliographyMetadata, Engine, CitationCluster, CslEngine } from 'citeproc';
import type Preview from '../models/preview';
import Citable from '../models/citable';
import validate from '../../libs/csl-validator';


export default class CslService {
  static processPreviewContent(preview: Preview): string {
    let styleSrc = preview.getTextDocument().getText().toString();
    return this.getPreviewWebViewContent(styleSrc, preview);
  }

  private static buildCslEngine(preview: Preview, styleSource: String): CslEngine {
    return new Engine(
      preview.getCiteProcResourceRetriever(),
      styleSource,
      preview.getForcedLang(),
      preview.getForcedLang()
    );
  }

  private static getPreviewWebViewContent(styleSrc: string, preview: Preview) {
    try {
      let cslEngine = this.buildCslEngine(preview, styleSrc);
      let citables = preview.getCitables();
      let citationCluster = this.buildCitationCluster(citables);
      cslEngine.updateItems(citables.map(citable => citable.id));

      let individualCitations = this.processIndividualCitations(cslEngine, citationCluster);
      let uniqueCitation = this.processUniqueCitation(cslEngine, citationCluster);
      let bibliography = cslEngine.makeBibliography();

      return this.formatHtmlPreview(individualCitations, uniqueCitation, bibliography);
    } catch (error) {
      return validate(styleSrc);
    }
  }

  private static buildCitationCluster(citables: Array<Citable>): CitationCluster {
    let citationItems = [];
    citables.forEach(citable => citationItems.push({ id: citable.id }));

    return { citationItems }
  }

  private static processIndividualCitations(cslEngine: CslEngine, citationCluster: CitationCluster): Array<String> {
    cslEngine.appendCitationCluster(citationCluster);
    return citationCluster.citationItems
      .map(item => cslEngine.appendCitationCluster({ citationItems: [item] })[0][1]);
  }

  private static processUniqueCitation(cslEngine: CslEngine, citationCluster: CitationCluster) {
    return cslEngine.processCitationCluster(citationCluster, [], []);
  }

  private static formatHtmlPreview(
    individualCitations: Array<String>,
    uniqueCitation: [metadata: Object, citations: Array<[index: Number, citation: String, id: String]>],
    bibliography: [metadata: BibliographyMetadata, htmlEntries: Array<String>]
  ) {
    let html = `<h3>${l10n.t('Individual citations')}</h3><hr>`;
    html += '<p>' + individualCitations.join('<br>') + '</p>';
    html += `<h3>${l10n.t('Unique citation')}</h3><hr>`;
    html += '<p>' + uniqueCitation[1][0][1] + '</p>';
    html += `<h3>${l10n.t('Bibliography')}</h3><hr>`;
    html += this.formatBibliographyHtml(bibliography);
    return html
  }

  static formatBibliographyHtml(
    bibliographyOutput: [metadata: BibliographyMetadata, htmlEntries: Array<String>]
  ): String {
    /*Strongly based in
    https://github.com/Juris-M/citeproc-js-docs/blob/master/_static/js/citesupport-es6.js
    */
    let bibliographyHtml = bibliographyOutput[0].bibstart;
    bibliographyHtml += bibliographyOutput[1].join('\n');
    let entries = RegExp('<div class="csl-entry">', 'g');
    let entryStyled = '<div class="csl-entry'
    if (bibliographyOutput[0].hangingindent) {
      entryStyled += '" style="margin-left: 1.3em;text-indent: -1.3em;';
      if (bibliographyOutput[0].linespacing != 1) {
        entryStyled += 'line-height: ' + bibliographyOutput[0].linespacing.toString() + ';'
      }
    } else if (bibliographyOutput[0]['second-field-align']) {
      var offsetSpec = 'padding-right:0.3em;';
      if (bibliographyOutput[0].maxoffset) {
        offsetSpec = 'width: ' + (bibliographyOutput[0].maxoffset / 2 + 0.5) + 'em;';
      }
      entryStyled += '" style="white-space: nowrap;';
      if (bibliographyOutput[0].linespacing != 1) {
        entryStyled += 'line-height: ' + bibliographyOutput[0].linespacing.toString() + ';'
      }
      let numbers = RegExp('<div class="csl-left-margin">', 'g');
      let numberStyled = '<div class="csl-left-margin" style="float:left; display:inline-block;' + offsetSpec + '">';
      bibliographyHtml = bibliographyHtml.replace(numbers, numberStyled);
      if (bibliographyOutput[0].maxoffset) {
        var widthSpec = '';
        let texts = RegExp('<div class="csl-right-inline">', 'g');
        widthSpec = 'width:' + (95) + '%;';
        let textStyled = '<div class="csl-right-inline" style="display: inline-block;white-space: normal;' + widthSpec + '">';
        bibliographyHtml = bibliographyHtml.replace(texts, textStyled);
      }
    }
    if (bibliographyOutput[0].entryspacing != 0) {
      let spacing = parseInt(bibliographyOutput[0].entryspacing);
      if (entryStyled.includes('style=')) {
        entryStyled += ' margin-bottom: ' + spacing + 'em;';
      } else {
        entryStyled += '" style="margin-bottom: ' + spacing + 'em;';
      }
    }
    entryStyled += '">'
    bibliographyHtml = bibliographyHtml.replace(entries, entryStyled);
    bibliographyHtml += bibliographyOutput[0].bibend;
    return bibliographyHtml;
  }
}