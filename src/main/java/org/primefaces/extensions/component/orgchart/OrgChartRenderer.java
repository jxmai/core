package org.primefaces.extensions.component.orgchart;

import java.io.IOException;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;

import org.primefaces.renderkit.CoreRenderer;
import org.primefaces.util.HTML;
import org.primefaces.util.WidgetBuilder;

public class OrgChartRenderer extends CoreRenderer {

    @Override
    public void encodeEnd(FacesContext context, UIComponent component) throws IOException {
        final OrgChart orgChart = (OrgChart) component;
        encodeMarkup(context, orgChart);
        encodeScript(context, orgChart);
    }

    /**
     * 
     * @param context
     * @param orgChart
     * @throws IOException
     */
    private void encodeMarkup(FacesContext context, final OrgChart orgChart) throws IOException {
        final ResponseWriter writer = context.getResponseWriter();
        final String clientId = orgChart.getClientId();
        final String widgetVar = orgChart.resolveWidgetVar();

        writer.startElement("div", orgChart);
        writer.writeAttribute("id", clientId, "id");
        writer.writeAttribute(HTML.WIDGET_VAR, widgetVar, null);
        writer.endElement("div");
    }

    /**
     * 
     * @param context
     * @param orgChart
     * @throws IOException
     */
    private void encodeScript(final FacesContext context, final OrgChart orgChart)
            throws IOException {
        final WidgetBuilder wb = getWidgetBuilder(context);
        final String clientId = orgChart.getClientId(context);

        wb.initWithDomReady("ExtOrgChart", orgChart.resolveWidgetVar(), clientId);
        wb.finish();
    }

}
