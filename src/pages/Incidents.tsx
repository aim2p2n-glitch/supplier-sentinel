import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

interface IncidentRecord {
  id: string;
  type: string;
  location: string;
  severity: string;
  startTime: string;
  description: string;
  affectedEntities: string[];
  status: string;
  source: string;
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchIncidents() {
      setLoading(true);
      try {
        const response = await fetch("https://genailab.tcs.in/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer sk-go1yJFk9G5u7vZR935Qt1g"
          },
          body: JSON.stringify({
            model: "azure/genailab-maas-gpt-4o",
            messages: [
              {
                role: "system",
                content: "Act as a Supply Chain Risk Analyst and generate a JSON array of 5 realistic logistics/transportation disruptions (e.g., strikes, port closures) causing outrage; return strictly valid JSON with fields: id, type, location, severity, startTime, description, affectedEntities, status output ONLY the JSON.."
              }
            ]
          })
        });
        const data = await response.json();
        let incidents: IncidentRecord[] = [];
        try {
          // Try to parse the LLM's response as JSON (handle string or object)
          let content = data.choices?.[0]?.message?.content;
          if (typeof content === 'string') {
            // Remove code block markers if present
            content = content.replace(/^```json|```$/g, '').trim();
            incidents = JSON.parse(content);
          } else {
            incidents = [];
          }
        } catch {
          incidents = [];
        }
        setIncidents(incidents);
      } catch (e) {
        setIncidents([]);
      }
      setLoading(false);
    }
    fetchIncidents();
  }, []);

  return (
    <MainLayout>
      <div className="p-6 space-y-8">
        <h2 className="text-xl font-semibold text-foreground mb-4">Incident Detection & Ingestion</h2>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Loading incidents from LLM...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Status</TableHead>
                
                  <TableHead>Affected Entities</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No incidents found.</TableCell>
                  </TableRow>
                ) : (
                  incidents.map((inc, idx) => (
                    <TableRow key={inc.id} className="animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                      <TableCell className="font-medium">{inc.type}</TableCell>
                      <TableCell>{inc.location}</TableCell>
                      <TableCell>{inc.severity}</TableCell>
                      <TableCell>{new Date(inc.startTime).toLocaleString()}</TableCell>
                      <TableCell>{inc.status}</TableCell>
                     
                      <TableCell>{inc.affectedEntities.join(', ')}</TableCell>
                      <TableCell>{inc.description}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
