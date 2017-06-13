package org.primefaces.extensions.component.orgchart;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.faces.FacesException;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;

import org.primefaces.json.JSONObject;
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

        OrgChartNode orgChartNode = null;
        if (null != orgChart) {
            if (!(orgChart instanceof OrgChartNode)) {
                throw new FacesException("The value attribute must be OrgChartNode");
            } else {
                orgChartNode = (OrgChartNode) orgChart.getValue();
            }
        }

        String data = toJSON(orgChartNode, orgChartNode.getChildren()).toString();

        wb.initWithDomReady("ExtOrgChart", orgChart.resolveWidgetVar(), clientId);
        wb.attr("nodeContent", orgChart.getNodeContent());
        wb.attr("direction", orgChart.getDirection());
        wb.attr("pan", orgChart.getPan());
        wb.attr("toggleSiblingsResp", orgChart.getToggleSiblingsResp());
        wb.attr("depth", orgChart.getDepth());
        wb.attr("exportButton", orgChart.getExportButton());
        wb.attr("exportFilename", orgChart.getExportFilename());
        wb.attr("exportFileextension", orgChart.getExportFileextension());
        wb.attr("parentNodeSymbol", orgChart.getParentNodeSymbol());
        wb.attr("draggable", orgChart.getDraggable());
        wb.attr("chartClass", orgChart.getChartClass());
        wb.attr("zoom", orgChart.getZoom());
        wb.attr("zoominLimit", orgChart.getZoominLimit());
        wb.attr("zoomoutLimit", orgChart.getZoomoutLimit());
        wb.attr("verticalDepth", orgChart.getVerticalDepth());
        wb.attr("nodeTitle", orgChart.getNodeTitle());
        wb.finish();
    }

    public JSONObject toJSON(OrgChartNode orgChartNode, List<OrgChartNode> children) {

        JSONObject json = new JSONObject();
        json.put("name", orgChartNode.getName());
        json.put("title", orgChartNode.getTitle());

        if (!orgChartNode.getChildren().isEmpty()) {
            List<JSONObject> jsonChildren = new ArrayList<JSONObject>();
            for (int i = 0; i < orgChartNode.getChildren().size(); i++) {
                jsonChildren.add(toJSON(orgChartNode.getChildren().get(i),
                        orgChartNode.getChildren().get(i).getChildren()));
            }
            json.put("children", jsonChildren);
        }

        return json;
    }

}
